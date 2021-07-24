import {
  Box,
  Center,
  IconButton,
  Icon,
  Tooltip,
  Stack,
} from "@chakra-ui/react";
import { FaCircle, FaSquare } from "react-icons/fa";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import { GoCloudUpload, GoMirror } from "react-icons/go";
import { IoMdPower, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import Video from "./Video";
import { UserMedia } from "./VideoSettings";

const SIZE_PCT = "98%";

export enum RecorderState {
  INITAL,
  MONITORING,
  RECORDING,
  PLAYBACK,
}

type PropTypes = {
  maxLength?: number;
  state: RecorderState;
  videoStream?: MediaStream;
  videoUrl?: string;
  requestPermission: () => any;
  startRecording: () => any;
  stopRecording: () => any;
  startUpload: () => any;
  discardRecording: () => any;
  focusSubmissionForm: () => any;
};

const VideoRecorder = ({
  state,
  videoStream,
  videoUrl,
  maxLength,
  requestPermission,
  startRecording,
  stopRecording,
  focusSubmissionForm,
  discardRecording,
}: PropTypes) => {
  let overlay;
  switch (state) {
    case RecorderState.INITAL:
      overlay = (
        <Center position="absolute" bottom={0} left={0} right={0} m={8}>
          <IconButton
            marginRight={2}
            size="lg"
            icon={<IoMdPower />}
            aria-label="Request permission to camera and microphone"
            onClick={requestPermission}
            isRound
          />{" "}
          <IconButton
            size="lg"
            icon={<GoCloudUpload />}
            aria-label="Upload a recording"
            isRound
          />
        </Center>
      );
      break;
    case RecorderState.MONITORING:
      overlay = (
        <Center position="absolute" bottom={0} left={0} right={0} m={8}>
          <IconButton
            marginRight={2}
            size="lg"
            color="red"
            icon={<FaCircle />}
            aria-label="Start recording"
            onClick={startRecording}
            isRound
          />
          <IconButton
            size="lg"
            icon={<GoCloudUpload />}
            aria-label="Upload a recording"
            isRound
          />
        </Center>
      );
      break;
    case RecorderState.RECORDING:
      overlay = (
        <Center
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={8}
          bgGradient="linear(to-t, blackAlpha.700, transparent)"
        >
          <IconButton
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.35)"
            size="lg"
            icon={<FaSquare />}
            aria-label="Stop"
            onClick={stopRecording}
            isRound
          />
        </Center>
      );
      break;
    case RecorderState.PLAYBACK:
      overlay = (
        <Stack direction="column" position="absolute" top={0} left={0} m={8}>
          <Tooltip
            hasArrow
            placement="right"
            label="Your video meets reqirements. Click to move onto submission"
          >
            <IconButton
              size="lg"
              icon={<IoMdCheckmarkCircleOutline />}
              aria-label="Your video meets reqirements. Click to move onto submission"
              onClick={focusSubmissionForm}
              isRound
            />
          </Tooltip>
          <Tooltip
            hasArrow
            placement="right"
            label="Discard this video and re-record"
          >
            <IconButton
              size="lg"
              icon={<FiTrash2 />}
              onClick={discardRecording}
              aria-label="Discard video"
              isRound
            />
          </Tooltip>
        </Stack>
      );
      break;
    default:
      overlay = null;
  }

  return (
    <Box w="928px" h="532px" bg="black" borderRadius={8} position="relative">
      <Center height="100%">
        {(state === RecorderState.MONITORING ||
          state === RecorderState.RECORDING) &&
          videoStream && (
            <Video srcObject={videoStream} autoPlay muted width={SIZE_PCT} mirror />
          )}

        {state === RecorderState.PLAYBACK && videoUrl && (
          <Video controls width={SIZE_PCT} src={videoUrl} />
        )}
      </Center>
      {overlay}
    </Box>
  );
};

export default VideoRecorder;
