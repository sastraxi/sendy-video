import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Progress,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { User } from "next-auth";
import { RefObject, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiCheck } from "react-icons/bi";
import { RecordedFile, SubmissionFormData } from "../models";

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

type PropTypes = {
  user?: User;
  magicCode: string;
  recording?: RecordedFile;
  titleRef: RefObject<HTMLInputElement>;
  onSuccess: (submissionId: number) => any;
};

const SubmissionForm = (props: PropTypes) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    reValidateMode: "onChange",
    defaultValues: {
      magicCode: props.magicCode,
      email: props.user?.email || "",
      mimeType: props.recording?.mimeType,
      fileSize: props.recording?.blob.size,
    },
  });

  const fileSize = watch("fileSize");

  useEffect(() => {
    if (props.recording) {
      setValue("mimeType", props.recording.mimeType);
      setValue("fileSize", props.recording.blob.size);
    } else {
      setValue("mimeType", undefined);
      setValue("fileSize", undefined);
    }
  }, [props.recording, setValue]);

  const onSubmit = handleSubmit(async (data: SubmissionFormData) => {
    console.log(data);
    setSubmitting(true); // FIXME: do a real state machine
    const initResponse = await axios.post("/api/submission/initiate", data);
    const { submissionId, resumableUrl, updateToken } = initResponse.data;

    setUploading(true);
    const { blob, mimeType } = props.recording!;
    try {
      const uploadResponse = await axios.post(resumableUrl, blob, {
        headers: {
          "Content-Type": mimeType,
        },
        timeout: 120 * 1000, // FIXME: seriously?!?
      });
      console.log("upload response", uploadResponse.data);
      const { id: fileId } = uploadResponse.data;
      setUploading(false);

      const finishResponse = await axios.post("/api/submission/finish", {
        submissionId,
        updateToken,
        fileId,
      });
      const { webLink } = finishResponse.data;
      console.log("web link", webLink);
      setSubmitting(false);
      props.onSuccess(submissionId);
    } catch (err) {
      console.error(err);
      setUploading(false);
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3} mt={8}>
        <FormControl id="title" isRequired>
          <FormLabel>Submission title</FormLabel>
          <Input type="title" {...register("title")} ref={props.titleRef} />
        </FormControl>
        <FormControl id="fileSize" isDisabled>
          <FormLabel>Submission size</FormLabel>
          <InputGroup>
            <Input
              variant="filled"
              isInvalid={!fileSize}
              value={
                fileSize
                  ? formatBytes(fileSize)
                  : "No video created or uploaded"
              }
            />
            {fileSize && !errors.fileSize && (
              <InputRightElement>
                <Icon as={BiCheck} color="green.500" w={6} h={6} />
              </InputRightElement>
            )}
          </InputGroup>
        </FormControl>
        <FormControl id="email" isDisabled={!!props.user}>
          <FormLabel>Email address</FormLabel>
          <InputGroup>
            <Input
              variant={props.user ? "filled" : "outline"}
              type="email"
              {...register("email")}
            />
            {!errors.email && (
              <InputRightElement>
                <Icon as={BiCheck} color="green.500" w={6} h={6} />
              </InputRightElement>
            )}
          </InputGroup>
          <FormHelperText>
            Your email address will be shared with the project owner.
          </FormHelperText>
        </FormControl>
        <HStack>
          <Button
            isLoading={submitting}
            mt={4}
            type="submit"
            size="lg"
            isDisabled={!props.recording}
          >
            Submit my video
          </Button>
          {uploading && (
            <Progress colorScheme="green" size="md" isIndeterminate w="50%" />
          )}
        </HStack>
      </Stack>
    </form>
  );
};

export default SubmissionForm;
