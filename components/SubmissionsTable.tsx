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
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Project, Submission } from "@prisma/client";
import Link from "next/link";
import { RiExternalLinkLine } from "react-icons/ri";
import formatBytes from "../utils/format-bytes";

import { format, formatDistance, formatRelative, subDays } from 'date-fns'

export type SubmissionAndProject = Submission & {
  project: Project;
};

export type PropTypes = {
  submissions: SubmissionAndProject[];
};

const SubmissionRow = ({ submission }: { submission: SubmissionAndProject }) => {
  return (
    <Tr>
      <Td>
        <Text>{submission.title}</Text>
        <Text fontSize="sm" color="blackAlpha.600">{submission.project.name}</Text>
      </Td>
      <Td isNumeric>
        <Text>{formatBytes(submission.fileSize)}</Text>
      </Td>
      <Td isNumeric>
        <Text>
          {formatRelative(submission.createdAt, new Date())}
        </Text>
      </Td>
      <Td isNumeric>
        {submission.webLink && (
          <Link href={submission.webLink} passHref>
            <Button
              ml={2}
              as="a"
              target="_blank"
              size="xs"
              leftIcon={<Icon as={RiExternalLinkLine} />}
              colorScheme="blue"
            >
              View
            </Button>
          </Link>
        )}
      </Td>
    </Tr>
  );
};

const SubmissionsTable = ({ submissions }: PropTypes) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Title / Project</Th>
          <Th isNumeric>Size</Th>
          <Th isNumeric>Created</Th>
          <Th isNumeric>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {submissions.map((s) => (
          <SubmissionRow submission={s} key={s.id} />
        ))}
      </Tbody>
    </Table>
  );
};

export default SubmissionsTable;
