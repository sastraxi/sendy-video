import type { NextApiRequest, NextApiResponse } from "next";
import generateCode from "../../utils/generate-code";
import prisma from "../../utils/db";
import { getSession } from "next-auth/client";
import { Prisma, Project } from "@prisma/client";
import {
  createDriveClient,
  PROVIDER_ID as GOOGLE_PROVIDER_ID,
} from "../../services/drive";
import { ProjectFormData } from "../../models";

type Folder = {
  id: string;
  webLink: string;
};

type Data = {
  projectId: number;
  magicCode: string;
  folder: Folder;
};

const PRISMA_UNIQUE_CONSTRAINT_VIOLATION = "P2002";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body, method } = req;
  const session = await getSession({ req });
  if (!session?.user) {
    res.status(401).end("You must be logged in to use this route");
  }
  const email = session!.user!.email!;

  const payload = body as ProjectFormData; // FIXME: validation via typecheck.macro
  switch (method) {
    case "POST": {
      // TODO: validate that a project with the same name doesn't already exist
      if (!payload.name) {
        res.status(400).end("Bad request: name must be provided");
      }

      // FIXME: janky, wish we had the user available immediately on every req
      // (and could thus change userEmail to userId in all relations)
      const user = await prisma.user.findUnique({
        where: {
          email: session!.user!.email!,
        },
        include: {
          accounts: true,
        },
      });
      const googleAccount = user?.accounts.find(
        (a) => a.providerId === GOOGLE_PROVIDER_ID
      );

      let folder: Folder | undefined = undefined;
      try {
        const drive = await createDriveClient(user!, googleAccount);
        await drive.ensureTopLevelFolderId();
        folder = await drive.createFolder(payload.name);
      } catch (e) {
        console.error("Could not do drive things", e);
        return res.status(500).end("Something went wrong with Drive");
      }

      let retries = 0;
      let project: Project | undefined = undefined;
      while (!project) {
        const magicCode = generateCode();
        try {
          project = await prisma.project.create({
            data: {
              ...payload,
              folderFileId: folder.id,
              folderWebLink: folder.webLink,
              magicCode,
              user: { connect: { email } },
            },
          });
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === PRISMA_UNIQUE_CONSTRAINT_VIOLATION) {
              retries += 1;
              console.log(`[x] ${magicCode}`);
            } else {
              throw e;
            }
          } else {
            throw e;
          }
        }
      }
      if (retries > 0) {
        console.log(`Did ${retries} retries before finding an unused code.`);
      }

      return res.status(200).json({
        projectId: project.id,
        magicCode: project.magicCode,
        folder,
      });
    }
    default: {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
