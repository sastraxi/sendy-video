import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../utils/db';
import { getSession } from 'next-auth/client';
import {
  createDriveClient,
  PROVIDER_ID as GOOGLE_PROVIDER_ID,
} from '../../services/drive';
import { SubmissionFormData } from '../../models';

type Data = {
  submissionId: number,
  resumableUrl: string,
  webLink: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body, method } = req;
  const session = await getSession({ req });
  const user = session?.user;
  const userEmail = user?.email;
  const payload = body as unknown as SubmissionFormData;

  switch (method) {
    case 'POST': {
      if (!payload.magicCode) {
        return res.status(400).end('magicCode must be provided')
      }
      if (!payload.mimeType) {
        return res.status(400).end('mimeType must be provided')
      }
      if (!payload.title) {
        return res.status(400).end('title must be provided')
      }
      if (
        !payload.fileSize ||
        !Number.isInteger(payload.fileSize) ||
        payload.fileSize === 0
      ) {
        return res.status(400).end('fileSize must be a positive integer');
      }

      const project = await prisma.project.findUnique({
        where: { magicCode: payload.magicCode },
        include: {
          user: {
            include: {
              accounts: true,
            },
          },
        },
      });
      if (!project) {
        return res.status(400).end(`the magicCode provided is invalid`);
      }

      if (!user && !project.ssoEnforced) {
        return res.status(400).end('This project requires you to be logged in to proceed.');
      }

      const googleAccount = project.user.accounts.find(
        a => a.providerId === GOOGLE_PROVIDER_ID,
      );
      const drive = await createDriveClient(project.user, googleAccount);
      const { resumableUrl, fileId } = await drive.startResumableUpload(
        project.folderFileId!, // FIXME: if drive integration failed earlier...?
        `${payload.title} (${new Date().toISOString()}).mp4`, // FIXME: better-named files
        payload.fileSize,
        payload.mimeType,
      );
      const webLink = await drive.getWebLink(fileId);

      console.log(resumableUrl, fileId, webLink);

      const submission = await prisma.submission.create({
        data: {
          email: userEmail || payload.email,
          user: userEmail ? { connect: { email: userEmail } } : undefined,
          title: payload.title,
          project: { connect: { id: project.id }},
          fileSize: payload.fileSize,
          fileId,
          webLink,
        },
      });

      return res.status(200).json({
        submissionId: submission.id,
        resumableUrl,
        webLink,
      });
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
