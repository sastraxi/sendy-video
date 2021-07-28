import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { SubmissionFormData } from "../../../models";
import {
  createDriveClient,
  PROVIDER_ID as GOOGLE_PROVIDER_ID,
} from "../../../services/drive";
import prisma from "../../../utils/db";

type Query = {
  id: number;
};

const grabHeader = (
  header: string | string[] | undefined
): string | undefined => {
  if (!header) return undefined;
  if (Array.isArray(header)) return header[0];
  return header;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, query } = req;
  const session = await getSession({ req });
  const user = session?.user;
  const userEmail = user?.email;
  const id = +query.id;

  switch (method) {
    case "DELETE": {
      if (!id || !+id) {
        return res.status(400).end("id must be a valid submission id");
      }
      if (!userEmail) {
        return res
          .status(403)
          .end("You must be logged in to use this endpoint");
      }

      // TODO: how to only grab relations?
      const submission = await prisma.submission.findUnique({
        where: { id },
        include: {
          user: { select: { email: true } },
          project: { select: { userEmail: true } },
        },
      });

      // submission owners and the owner of the project submitted to have access
      if (
        submission.user.email !== userEmail &&
        submission.project.userEmail !== userEmail
      ) {
        return res
          .status(403)
          .end("You do not have permission to delete this submission");
      }

      const project = await prisma.submission.delete({
        where: { id },
      });

      // TODO: figure out if this is owned by the project owner or submitter (correct google credentials)
      // TODO: refresh the project owners' credentials here if the submitter is deleting a file owned by them
      // TODO: if owned by submitter (and project owner is the one deleting), just delete the shortcut

      // const googleAccount = project.user.accounts.find(
      //   (a) => a.providerId === GOOGLE_PROVIDER_ID
      // );
      // const drive = await createDriveClient(project.user, googleAccount);
      // const { resumableUrl } = await drive.startResumableUpload(
      //   project.folderFileId!, // FIXME: if drive integration failed earlier...?
      //   `${payload.title} (${new Date().toISOString()}).mp4`, // FIXME: better-named files
      //   payload.fileSize,
      //   payload.mimeType
      // );

      return res.status(200).end();
    }
    default: {
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
