import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import {
  createDriveClient,
  PROVIDER_ID as GOOGLE_PROVIDER_ID
} from "../../../services/drive";
import prisma from "../../../utils/db";

type Payload = {
  submissionId: number,
  fileId: string,
  updateToken: string,
};

type Data = {
  webLink: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body, method } = req;
  const session = await getSession({ req });
  const user = session?.user;
  const userEmail = user?.email;
  const payload = body as unknown as Payload;

  switch (method) {
    case "POST": {
      if (!payload.submissionId) {
        return res.status(400).end("submissionId must be provided");
      }
      if (!payload.fileId) {
        return res.status(400).end("fileId must be provided");
      }
      if (!payload.updateToken) {
        return res.status(400).end("updateToken must be provided");
      }

      const submission = await prisma.submission.findUnique({
        where: {
          id: payload.submissionId,
        },
        include: {
          project: {
            include: {
              user: {
                include: {
                  accounts: true,
                },
              },
            },
          },
        },
      });

      if (!submission || !!submission.fileId) {
        return res.status(400).end(`the submissionId provided is invalid`);
      }
      if (submission.updateToken !== payload.updateToken) {
        return res.status(400).end('the updateToken provided is invalid');
      }

      const { fileId } = payload;
      const { project } = submission;
      const googleAccount = project.user.accounts.find(
        (a) => a.providerId === GOOGLE_PROVIDER_ID
      );
      const drive = await createDriveClient(project.user, googleAccount);
      const webLink = await drive.getWebLink(fileId);

      await drive.updateMetadata(
        fileId,
        submission.metadata as { [key: string]: string }
      );

      if (userEmail) {
        // share directly with submitter in the google ecosystem
        await drive.shareWithUser(fileId, userEmail);
      } else {
        // the user can save the web link they're given to access the file later anonymously
        await drive.makePublicWithLink(fileId, true);
      }

      return res.status(200).json({ webLink });
    }
    default: {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
