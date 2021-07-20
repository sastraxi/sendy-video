import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../utils/db';
import { getSession } from 'next-auth/client';
import {
  createDriveClient,
  PROVIDER_ID as GOOGLE_PROVIDER_ID,
} from '../../services/drive';

type Payload = {
  magicCode: string,
  mimeType: string,
  fileSize: string,
  email?: string,
  name?: string,
}

type Data = {
  submissionId: number,
  resumableUrl: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query, method } = req;
  const session = await getSession({ req });
  const user = session?.user;
  const userEmail = user?.email;
  const payload = query as Payload;
  const name = user ? (user.name || user.email!) : payload.name!;

  switch (method) {
    case 'POST': {
      if (!payload.magicCode) {
        return res.status(400).end('magicCode must be provided')
      }
      if (!payload.mimeType) {
        return res.status(400).end('mimeType must be provided')
      }
      if (
        !payload.fileSize ||
        !Number.isInteger(payload.fileSize) || // XXX: typescript
        payload.fileSize === '0'
      ) {
        return res.status(400).end('fileSize must be a positive integer');
      }
      if (!user && !payload.name) {
        return res.status(400).end('You must include a name if not logged in');
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

      const googleAccount = project.user.accounts.find(
        a => a.providerId === GOOGLE_PROVIDER_ID,
      );
      const drive = await createDriveClient(project.user, googleAccount);
      const { resumableUrl, fileId } = await drive.startResumableUpload(
        project.driveFileId!, // XXX: if drive integration failed earlier...?
        `${name} (${Date.now()}).mp4`, // FIXME: better-named files
        +payload.fileSize,
        payload.mimeType,
      );

      const submission = await prisma.submission.create({
        data: {
          email: payload.email,
          name,
          projectId: project.id,
          fileSize: +payload.fileSize,
          driveFileId: fileId,
        },
      });

      return res.status(200).json({
        submissionId: submission.id,
        resumableUrl,
      });
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
