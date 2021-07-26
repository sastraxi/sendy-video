import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../utils/db";

type Payload = {
  submissionId: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;
  const session = await getSession({ req });
  const user = session?.user;
  const userEmail = user?.email;
  const payload = query as Payload;

  switch (method) {
    case "GET": {
      const submissionId = +payload.submissionId;
      if (Number.isNaN(submissionId)) {
        return res.status(400).end("Invalid submission ID.");
      }

      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        select: {
          userEmail: true,
          webLink: true,
          project: {
            select: {
              userEmail: true,
            },
          },
        },
      });

      if (!submission || !submission.webLink) {
        return res.status(400).end("Invalid submission ID.");
      }

      if (
        submission.project.userEmail !== userEmail &&
        submission.userEmail !== userEmail
      ) {
        return res
          .status(403)
          .end("You do not have permission to access this submission.");
      }

      return res.redirect(submission.webLink);
    }
    default: {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
