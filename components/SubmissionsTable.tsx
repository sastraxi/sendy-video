import {
  Button,
  Icon,
  Link as ChakraLink,
  Table,
  Tbody,
  IconButton,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Project, Submission } from "@prisma/client";
import { formatRelative } from "date-fns";
import { RiExternalLinkLine } from "react-icons/ri";
import { FiTrash2 } from "react-icons/fi";
import formatBytes from "../utils/format-bytes";

import { useState } from "react";
import axios from "axios";

export type SubmissionAndProject = Submission & {
  project: Project;
};

export type PropTypes = {
  submissions: SubmissionAndProject[];
  onDelete: (subission: SubmissionAndProject) => any,
};

export type RowPropTypes = {
  submission: SubmissionAndProject,
  onDelete: (subission: SubmissionAndProject) => any,
};

const DeleteButton = ({ submission, onDelete }: RowPropTypes) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const actuallyDelete = async () => {
    setIsDeleting(true);

    // TODO: error handling
    await axios.delete(`/api/submission/${submission.id}`);
    
    setIsDeleting(false);
    onClose();
    onDelete(submission);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Your file will be deleted from Google Drive and may be
            unrecoverable. The project owner will no longer have access.
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isDeleting}
              colorScheme="red"
              mr={3}
              onClick={actuallyDelete}
            >
              Delete
            </Button>
            <Button isDisabled={isDeleting} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <IconButton
        size="sm"
        icon={<FiTrash2 />}
        onClick={onOpen}
        aria-label="Discard video"
        colorScheme="red"
        isRound
      />
    </>
  );
};

const SubmissionRow = ({ submission, onDelete }: RowPropTypes) => {
  return (
    <Tr>
      <Td>
        {submission.webLink && (
          <ChakraLink isExternal href={submission.webLink}>
            {submission.title}
            <Icon verticalAlign="-2px" as={RiExternalLinkLine} ml={2} />
          </ChakraLink>
        )}
        {!submission.webLink && <Text>{submission.title}</Text>}
        <Text fontSize="sm" color="blackAlpha.600">
          {submission.project.name}
        </Text>
      </Td>
      <Td isNumeric>
        <Text>{formatBytes(submission.fileSize)}</Text>
      </Td>
      <Td isNumeric>
        <Text>{formatRelative(submission.createdAt, new Date())}</Text>
      </Td>
      <Td isNumeric>
        <DeleteButton onDelete={onDelete} submission={submission} />
      </Td>
    </Tr>
  );
};

const SubmissionsTable = ({ submissions, onDelete }: PropTypes) => {
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
          <SubmissionRow onDelete={onDelete} submission={s} key={s.id} />
        ))}
      </Tbody>
    </Table>
  );
};

export default SubmissionsTable;
