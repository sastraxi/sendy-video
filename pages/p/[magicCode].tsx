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
import SplashModal from "../../components/SplashModal";
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

import { Avatar, Center, Container, Flex, Box, Text, Badge, Button } from "@chakra-ui/react"

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
    image: string | null,
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
        <SplashModal
          heading="Project not found"
          message="The link you clicked is invalid, or has expired."
        />
      </div>
    )
  }

  if (project.maxSubmissions && project._count!.submissions >= project.maxSubmissions) {
    return (
      <div>
        <Header />
        <SplashModal
          heading="Submissions closed"
          message="This project has reached its maximum number of submissions."
        />
      </div>
    )
  }

  if (project.ssoEnforced && project.ssoMaxSubmissions && project.submissions.length >= project.ssoMaxSubmissions) {
    return (
      <div>
        <Header />
        <SplashModal
          heading="Submissions closed"
          message="You have already submitted the maximum number of submissions to this project."
        />
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
      <Container marginTop="6">
        <Flex>
          <Avatar
            name={project.user.name || undefined}
            src={project.user.image || undefined}
          />
          <Box ml="3">
            <Text fontWeight="bold">
              {project.user.name}
            </Text>
            <Text fontSize="sm">Project Owner</Text>
          </Box>
        </Flex>
        {project.markdown && <ReactMarkdown components={ChakraUIRenderer()}>{project.markdown}</ReactMarkdown>}
        <Center>
          <Button>Submit my video</Button>
        </Center>
      </Container>
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
          image: true,
        },
      },
    },
    
  });
  const props: PropTypes = { project: project || undefined };
  return { props };
};
