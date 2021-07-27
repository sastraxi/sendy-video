import Link from "next/link";
import styled from "@emotion/styled";
import { Project } from "@prisma/client";

import {
  Table,
  Thead,
  Th,
  Td,
  Tr,
  Tbody,
  Text,
  Button,
  HStack,
  Icon,
} from "@chakra-ui/react";

import { RiExternalLinkLine } from "react-icons/ri";

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
          <Tr key={project.id}>
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
                <Link href={`/p/${project.magicCode}`} passHref>
                  <Button size="xs">
                    {project.magicCode}
                  </Button>
                </Link>
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
        ))}
      </Tbody>
    </Table>
  );
};

export default ProjectsTable;
