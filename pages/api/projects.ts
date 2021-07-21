import type { NextApiRequest, NextApiResponse } from 'next'
import generateCode from '../../utils/generate-code';
import prisma from '../../utils/db';
import { getSession } from 'next-auth/client';
import { Prisma, Project } from '@prisma/client';
import {
  createDriveClient,
  PROVIDER_ID as GOOGLE_PROVIDER_ID,
} from '../../services/drive';
import { ProjectFormData } from '../../models';

type Data = {
  projectId: number,
  magicCode: string,
  folderFileId: string,
}

const PRISMA_UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body, method } = req;
  const session = await getSession({ req });
  if (!session?.user) {
    res.status(401).end('You must be logged in to use this route')
  }
  const email = session!.user!.email!;

  const payload = body as ProjectFormData // FIXME: validation via typecheck.macro
  switch (method) {
    case 'POST': {
      // TODO: validate that a project with the same name doesn't already exist
      if (!payload.name) {
        res.status(400).end('Bad request: name must be provided')
      }

      // FIXME: janky, wish we had the user available immediately on every req
      // (and could thus change userEmail to userId in all relations)
      const user = await prisma.user.findUnique({
        where: {
          email: session!.user!.email!,
        },
        include: {
          accounts: true,
        }
      })
      const googleAccount = user?.accounts.find(a => a.providerId === GOOGLE_PROVIDER_ID);
      let folderFileId: string | undefined = undefined;
      try {
        const drive = await createDriveClient(user!, googleAccount);
        await drive.ensureTopLevelFolderId();
        folderFileId = await drive.createFolder(payload.name);
      } catch (e) {
        console.error('Could not do drive things', e);
        return res.status(500).end('Something went wrong with Drive');
      }

      let project: Project | undefined = undefined;
      while (!project) {
        const magicCode = generateCode();
        try {
          project = await prisma.project.create({
            data: {
              ...payload,
              folderFileId,
              magicCode,
              user: { connect: { email } },
            }
          });
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === PRISMA_UNIQUE_CONSTRAINT_VIOLATION) {
              console.log(`Magic code ${magicCode} already in use; generating a new one...`);
            } else {
              throw e;
            }
          } else {
            throw e;
          }
        }
      }

      await prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          folderFileId,
        },
      });

      return res.status(200).json({
        projectId: project.id,
        magicCode: project.magicCode,
        folderFileId,
      });
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
