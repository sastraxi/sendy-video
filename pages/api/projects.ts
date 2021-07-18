import type { NextApiRequest, NextApiResponse } from 'next'
import generateCode from '../../utils/generate-code';
import prisma from '../../utils/db';
import { getSession } from 'next-auth/client';

type Payload = {
  name: string,
  markdown?: string, 
}

type Data = {
  projectId: number,
  magicCode: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query, method } = req;
  const session = await getSession({ req });
  if (!session?.user) {
    res.status(401).end('You must be logged in to use this route')
  }

  const payload = query as Payload
  switch (method) {
    case 'POST': {
      if (!payload.name) {
        res.status(400).end('Bad request: name must be provided')
      }
      const magicCode = generateCode();
      const project = await prisma.project.create({
        data: {
          name: payload.name,
          markdown: payload.markdown,
          userEmail: session!.user!.email!,
          magicCode,
        }
      });
      return res.status(200).json({
        projectId: project.id,
        magicCode,
      });
    }
    default: {
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
