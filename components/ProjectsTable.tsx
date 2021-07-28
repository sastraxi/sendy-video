import {
  Button,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useClipboard,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Project } from "@prisma/client";
import Link from "next/link";
import { RiExternalLinkLine } from "react-icons/ri";
import { HiOutlineClipboardCopy } from "react-icons/hi";

export type ProjectAndSubmissionCount = Project & {
  _count: {
    submissions: number;
  } | null;
};

export type PropTypes = {
  projects: ProjectAndSubmissionCount[];
};

const Anchor = styled.a`
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ProjectRow = ({ project }: { project: ProjectAndSubmissionCount }) => {
  const { hasCopied, onCopy } = useClipboard(
    `${typeof(window) !== 'undefined' ? window.location.origin : process.env.NEXTAUTH_URL}/p/${
      project.magicCode
    }`
  );
  return (
    <Tr>
      <Td>
        <Link href={`/projects/${project.id}`} passHref>
          <Anchor>{project.name}</Anchor>
        </Link>
      </Td>
      <Td isNumeric>
        <Text>{project._count!.submissions}</Text>
      </Td>
      <Td isNumeric></Td>
      <Td isNumeric>
        <Button
          size="xs"
          onClick={onCopy}
          leftIcon={<Icon as={HiOutlineClipboardCopy} w={4} h={4} mt="-2px" />}
          colorScheme={hasCopied ? "pink" : undefined}
        >
          {hasCopied ? "Copied!" : "Get link"}
        </Button>
        {project.folderWebLink && (
          <Link href={project.folderWebLink} passHref>
            <Button
              ml={2}
              as="a"
              target="_blank"
              size="xs"
              leftIcon={<Icon as={RiExternalLinkLine} />}
              colorScheme="blue"
            >
              Submissions
            </Button>
          </Link>
        )}
      </Td>
    </Tr>
  );
};

const ProjectsTable = ({ projects }: PropTypes) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th isNumeric>Submissions</Th>
          <Th isNumeric>Size</Th>
          <Th isNumeric>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {projects.map((project) => (
          <ProjectRow project={project} key={project.id} />
        ))}
      </Tbody>
    </Table>
  );
};

export default ProjectsTable;
