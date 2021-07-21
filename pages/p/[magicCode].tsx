// https://developers.google.com/web/fundamentals/media/recording-video
// https://github.com/muxinc/upchunk
// https://stackoverflow.com/questions/27251953/how-to-create-file-object-from-blob
import Head from "next/head";
import { getSession } from "next-auth/client";
import { GetServerSideProps } from "next";
import prisma from "../../utils/db";
import Link from 'next/link'
import { Project, Submission } from "@prisma/client";
import VideoBanner from '../../components/VideoBanner';
import ReactMarkdown from "react-markdown";

export type ProjectAndYourSubmissions = Project & {
  _count: {
    /* everyone's submissions */
    submissions: number;
  } | null;
  /* your submissions only */
  submissions: Submission[],
  /* owner of this project */
  user: {
    name: string | null,
  },
};

type PropTypes = {
  project?: ProjectAndYourSubmissions,
};

const Header = () => (
  <Head>
    <title>sendy 📷 | submit</title>
    <meta name="description" content="Let your friends upload videos directly into your Google Drive" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

export default function Submit({ project }: PropTypes) {
  if (!project) {
    return (
      <div>
        <Header />
        <NotFoundMessage />
      </div>
    )
  }

  if (project.maxSubmissions && project._count!.submissions >= project.maxSubmissions) {
    return (
      <div>
        <Header />
        <ClosedMessage reason="maximum number of submissions" />
      </div>
    )
  }

  if (project.ssoEnforced && project.ssoMaxSubmissions && project.submissions.length >= project.ssoMaxSubmissions) {
    return (
      <div>
        <Header />
        <ClosedMessage reason="you have already submitted the maximum number of submissions" />
      </div>
    )
  }

  // TODO: max length per submission
  return (
    <div>
      <Header />
      <VideoBanner
        maxLength={project.maxSubmissionLength || undefined}
      />
      <Content>
        <Avatar name={project.user.name} />
        {project.markdown && <ReactMarkdown>{project.markdown}</ReactMarkdown>}
        <Figure>
          <button>Submit</button>
        </Figure>
      </Content>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { magicCode } = query;
  const session = await getSession({ req });
  const project = await prisma.project.findUnique({
    where: {
      magicCode: magicCode as string,
    },
    include: {
      _count: {
        select: { submissions: true },
      },
      submissions: {
        where: {
          userEmail: session?.user?.email,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
    
  });
  const props: PropTypes = { project: project || undefined };
  return { props };
};
