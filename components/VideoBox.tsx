import {
  Box, Center, IconButton
} from "@chakra-ui/react";
import { FaCircle, FaSquare } from "react-icons/fa";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import { GoCloudUpload } from "react-icons/go";
import Video from "./Video";


export enum RecorderState {
  INITIAL,
  RECORDING,
  STOPPED,
  PLAYBACK,
}

type PropTypes = {
  maxLength?: number;
  state: RecorderState;
  videoStream?: MediaStream;
  videoUrl?: string;
  startRecording: () => any;
  startUpload: () => any;
};

const VideoRecorder = ({
  state,
  videoStream,
  videoUrl,
  maxLength,
  startRecording,
}: PropTypes) => {
  let overlay;
  switch (state) {
    case RecorderState.INITIAL:
      overlay = (
        <Center position="absolute" bottom={0} left={0} right={0} m={8}>
          <IconButton
            marginRight={2}
            size="lg"
            color="red"
            icon={<FaCircle />}
            aria-label="Start recording"
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
        <Center position="absolute" bottom={0} left={0} right={0} m={8}>
          <IconButton size="lg" icon={<FaSquare />} aria-label="Stop" isRound />
        </Center>
      );
      break;
    case RecorderState.STOPPED:
      overlay = (
        <Center position="absolute" bottom={0} left={0} right={0} m={8}>
          <IconButton
            size="lg"
            icon={<GiPlayButton />}
            aria-label="Play"
            isRound
          />
          {/* TODO: seek bar */}
        </Center>
      );
      break;
    case RecorderState.PLAYBACK:
      overlay = (
        <Center position="absolute" bottom={0} left={0} right={0} m={8}>
          <IconButton
            size="lg"
            icon={<GiPauseButton />}
            aria-label="Pause"
            isRound
          />
          {/* TODO: seek bar */}
        </Center>
      );
      break;
    default:
      overlay = null;
  }

  return (
    <Box w="800px" h="454px" bg="black" borderRadius={8} position="relative">
      {overlay}
      {videoUrl && <Video src={videoUrl} />}
      {videoStream && <Video srcObject={videoStream} />}
    </Box>
  );
};

export default VideoRecorder;
