// https://developers.google.com/web/fundamentals/media/recording-video
// https://github.com/muxinc/upchunk
// https://stackoverflow.com/questions/27251953/how-to-create-file-object-from-blob
import Head from "next/head";
import { useRouter } from 'next/router';
import { useRef, useState } from "react";
import { getSession } from "next-auth/client";
import { GetServerSideProps } from "next";
import prisma from "../../utils/db";
import Link from "next/link";
import { Project, Submission } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

import SubmissionForm from '../../components/SubmissionForm';

import {
  Avatar,
  Center,
  Container,
  Flex,
  Box,
  Text,
  Button,
  Input,
  Badge,
  Spacer,
} from "@chakra-ui/react";

import VideoBanner from "../../components/VideoBanner";
import SplashModal from "../../components/SplashModal";
import { RecordedFile } from "../../models";
import { User } from "next-auth";
import HelpContent from "../../components/HelpContent";

import { BsArrowLeft } from 'react-icons/bs';
import TopMenu from "../../components/TopMenu";

export type ProjectAndYourSubmissions = Project & {
  _count: {
    /* everyone's submissions */
    submissions: number;
  } | null;
  /* your submissions only */
  submissions: Submission[];
  /* owner of this project */
  user: {
    name: string | null;
    image: string | null;
  };
};

type PropTypes = {
  project?: ProjectAndYourSubmissions;
  user?: User,
};
const Header = ({ title }: { title: string }) => (
  <Head>
    <title>Sendy ✈️ | {title}</title>
    <meta
      name="description"
      content="Let your friends upload videos directly into your Google Drive"
    />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

export default function Submit({ project, user }: PropTypes) {
  const [recording, setRecording] = useState<RecordedFile | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const formEl = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (!project) {
    return (
      <div>
        <Header title="Not found" />
        <SplashModal
          heading="Project not found"
          message="The link you clicked is invalid, or has expired."
        />
      </div>
    );
  }

  if (
    project.maxSubmissions &&
    project._count!.submissions >= project.maxSubmissions
  ) {
    return (
      <div>
        <Header title="Submissions closed" />
        <SplashModal
          heading="Submissions closed"
          message="This project has reached its maximum number of submissions."
        />
      </div>
    );
  }

  if (
    project.ssoEnforced &&
    project.ssoMaxSubmissions &&
    project.submissions.length >= project.ssoMaxSubmissions
  ) {
    return (
      <div>
        <Header title="Submissions closed" />
        <SplashModal
          heading="Submissions closed"
          message="You have already submitted the maximum number of submissions to this project."
        />
      </div>
    );
  }

  const projectContent = project.markdown && (
    <>
      <ReactMarkdown components={ChakraUIRenderer()}>
        {project.markdown}
      </ReactMarkdown>
      <SubmissionForm
        magicCode={project.magicCode}
        user={user}
        titleRef={formEl}
        recording={recording || undefined}
        onSuccess={(submissionId) => {
          localStorage.setItem("created", `submission:${submissionId}`);
          router.push('/projects');
        }}
      />
    </>
  );
  const content = !showHelp ? projectContent : <HelpContent />;

  // TODO: max length per submission
  return (
    <div>
      <Header title={project.name} />
      { user && <TopMenu user={user} /> }
      <VideoBanner
        maxLength={project.maxSubmissionLength || undefined}
        focusSubmissionForm={() => formEl.current?.focus()}
        recording={recording}
        setRecording={setRecording}
      />
      <Container mt={6} mb={14}>
        <Flex mb={8}>
          <Flex>
            <Avatar
              name={project.user.name || undefined}
              src={project.user.image || undefined}
            />
            <Box ml="3">
              <Text fontWeight="bold">
                {project.user.name}
                {user && user.email === project.userEmail && <Badge ml={1.5} verticalAlign="1px" colorScheme="green">YOU</Badge>}
              </Text>
              <Text fontSize="sm">Project Owner</Text>
            </Box>
          </Flex>
          <Spacer />
          <Button onClick={() => setShowHelp(!showHelp)} leftIcon={showHelp ? <BsArrowLeft /> : undefined}>
            {showHelp ? "Back to Project" : "Need help?"}
          </Button>
        </Flex>
        {content}
      </Container>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
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
  const props: PropTypes = {
    project: project || undefined,
    user: session?.user,
  };
  return { props };
};
