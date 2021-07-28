import {
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Spacer,
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RiExternalLinkLine } from "react-icons/ri";
import ProjectForm from "../../components/ProjectForm";
import { ProjectFormData } from "../../models";
import prisma from "../../utils/db";

// import { useForm } from "react-hook-form";
// https://react-hook-form.com/get-started#TypeScript

type ProjectAndSubmissionCount = Project & {
  _count: {
    submissions: number;
  } | null;
};

type PropTypes = {
  project: ProjectAndSubmissionCount;
};

export default function EditProject(props: PropTypes) {
  const router = useRouter();
  const onSubmit = async (data: ProjectFormData) => {
    // TODO: remove name, add back id
    alert("Allan please implement PATCH /api/project/:id")
  };

  const { project } = props;
  return (
    <div>
      <Head>
        <title>Sendy ✈️ | Edit {project.name}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="960px" pt={12}>
        <Flex>
          <Heading size="xl" mb={8}>
            {project.name}
          </Heading>
          <Spacer />

          {project.folderWebLink && (
            <Link href={project.folderWebLink} passHref>
              <Button
                ml={2}
                as="a"
                target="_blank"
                size="lg"
                leftIcon={<Icon as={RiExternalLinkLine} />}
                colorScheme="blue"
              >
                View Submissions ({project._count?.submissions})
              </Button>
            </Link>
          )}
        </Flex>
        <ProjectForm project={project} onSubmit={onSubmit} />
      </Container>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  if (!session?.user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  const { projectId } = query;
  if (!projectId) {
    return {
      redirect: {
        permanent: false,
        destination: "/projects",
      },
    };
  }
  const { email } = session.user;
  const project = await prisma.project.findFirst({
    where: {
      userEmail: email!,
      id: +projectId,
    },
    include: {
      _count: {
        select: { submissions: true },
      },
    },
  });
  if (!project) {
    return {
      redirect: {
        permanent: false,
        destination: "/projects",
      },
    };
  }
  return { props: { project } };
};
