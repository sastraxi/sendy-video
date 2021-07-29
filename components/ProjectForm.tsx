import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import Link from "next/link";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { ProjectFormData } from "../models";

type PropTypes = {
  onSubmit: (data: ProjectFormData) => any;
  project?: Project;
};

function removeNulls(obj: any): any {
  if (obj === null) {
    return undefined;
  }
  if (typeof obj === "object") {
    for (let key in obj) {
      obj[key] = removeNulls(obj[key]);
    }
  }
  return obj;
}

const ProjectForm = (props: PropTypes) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: props.project
      ? removeNulls({
          ...props.project,
        })
      : {
          isOpen: true,
          ssoEnforced: true,
          ssoSharedVideos: true,
        },
  });
  const watched = watch(); // TODO: useWatch and sub-components
  const onSubmit = handleSubmit(async (data: ProjectFormData) => {
    if (!data.ssoMaxSubmissions) {
      delete data.ssoMaxSubmissions;
    } else {
      data.ssoMaxSubmissions = +data.ssoMaxSubmissions;
    }
    return props.onSubmit(data);
  });

  return (
    <form onSubmit={onSubmit}>
      {/* name */}
      <Grid templateColumns="1fr 1fr" w="100%" rowGap={4} columnGap={12}>
        <Box>
          {!props.project && (
            <FormControl id="name" isRequired isInvalid={!!errors.name}>
              <FormLabel>Project name</FormLabel>
              <Input
                type="name"
                {...register("name", { required: true, maxLength: 50 })}
              />

              {/* use role="alert" to announce the error message */}
              {errors.name && errors.name.type === "required" && (
                <FormErrorMessage>This is required.</FormErrorMessage>
              )}
              {errors.name && errors.name.type === "maxLength" && (
                <FormErrorMessage>Maximum length exceeded.</FormErrorMessage>
              )}
            </FormControl>
          )}
        </Box>
        <Box />
        <Box>
          <FormControl id="markdown" isRequired isInvalid={!!errors.markdown}>
            <FormLabel>Instructions</FormLabel>
            <Textarea minH={240} {...register("markdown")} />
          </FormControl>
        </Box>
        <Box
          maxH={280}
          border="1px solid rgba(30, 40, 40, 0.77)"
          boxShadow="12px 12px 0 rgba(30, 40, 40, 0.16)"
          p={4}
          overflow="hidden"
          overflowY="auto"
          minWidth={0}
          minHeight={0}
        >
          {watched.markdown && (
            <ReactMarkdown components={ChakraUIRenderer()}>
              {watched.markdown}
            </ReactMarkdown>
          )}
        </Box>
        <Heading size="md" mt={6} mb={8}>
          Requirements
        </Heading>
        <Box />
        <Box>
          <FormControl
            display="flex"
            alignItems="center"
            id="isOpen"
            isInvalid={!!errors.isOpen}
          >
            <FormLabel mb={0}>Open for submissions?</FormLabel>
            <Switch {...register("isOpen")} />
          </FormControl>
        </Box>
        <Box>
          {watched.isOpen && (
            <p>
              Submissions can be made by visiting{" "}
              {!props.project && <code>https://sendy.video/p/xxxxxx</code>}
              {props.project && (
                <Link href={`/p/${props.project.magicCode}`}>
                  <a target="_blank">
                    https://sendy.video/p/{props.project.magicCode}
                  </a>
                </Link>
              )}
            </p>
          )}
          {!watched.isOpen && <p>Noone can make submissions.</p>}
        </Box>
        <Box>
          <FormControl
            display="flex"
            alignItems="center"
            id="ssoEnforced"
            isInvalid={!!errors.ssoEnforced}
          >
            <FormLabel mb={0}>Require Google SSO?</FormLabel>
            <Switch {...register("ssoEnforced")} />
          </FormControl>
        </Box>
        <Box>
          {!watched.ssoEnforced && (
            <p>Warning: anyone with the link can make video submissions!</p>
          )}
        </Box>
        {watched.ssoEnforced && (
          <>
            <Box>
              <FormControl
                id="ssoMaxSubmissions"
                isInvalid={!!errors.ssoMaxSubmissions}
              >
                <FormLabel>Maximum submissions per login</FormLabel>
                <NumberInput>
                  <NumberInputField
                    {...register("ssoMaxSubmissions", {
                      min: 1,
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Box>
            <Box>
              {!watched.ssoMaxSubmissions && (
                <p>Users can submit an unlimited number of submissions.</p>
              )}
            </Box>
          </>
        )}
        {watched.ssoEnforced && (
          <>
            <Box>
              <FormControl
                id="ssoSharedVideos"
                isInvalid={!!errors.ssoSharedVideos}
                display="flex"
                alignItems="center"
              >
                <FormLabel mb={0}>
                  Store videos in submitter&apos;s account
                </FormLabel>
                <Switch {...register("ssoSharedVideos")} />
              </FormControl>
            </Box>
            <Box>
              {!watched.ssoSharedVideos && (
                <p>
                  Warning: users will upload videos directly to your drive! You
                  take responsibility for what is uploaded to your account.
                </p>
              )}
            </Box>
          </>
        )}
        {watched.ssoEnforced && (
          <>
            <Box>
              <FormControl id="ssoDomain" isInvalid={!!errors.ssoDomain}>
                <FormLabel>Restrict to email domain</FormLabel>
                <Input
                  type="ssoDomain"
                  {...register("ssoDomain", { maxLength: 80 })}
                />

                {/* use role="alert" to announce the error message */}
                {errors.ssoDomain && errors.ssoDomain.type === "required" && (
                  <FormErrorMessage>This is required.</FormErrorMessage>
                )}
                {errors.ssoDomain && errors.ssoDomain.type === "maxLength" && (
                  <FormErrorMessage>Maximum length exceeded.</FormErrorMessage>
                )}
              </FormControl>
            </Box>
            <Box>
              {watched.ssoDomain && (
                <p>
                  Users must have an account whose email address ends with{" "}
                  <code>@{watched.ssoDomain}</code> in order to submit a video.
                </p>
              )}
            </Box>
          </>
        )}
      </Grid>
      {/* [ ] current / <max> submissions */}
      {/* [ ] current / <max> gb */} {/* only your drive */}
      {/* automatically closes at <yyyy-mm-ddthh:mm:ss> --> need tokens to prevent frustration */}
      <Button
        isLoading={false}
        mt={4}
        type="submit"
        size="lg"
        colorScheme="green"
      >
        { props.project ? 'Save' : 'Create project' }
      </Button>
    </form>
  );
};

export default ProjectForm;
