import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Code,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Select,
  Spacer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaMicrophone, FaVideo } from "react-icons/fa";
import { RecordedFile } from "../models";
import VideoBox, { RecorderState } from "./VideoBox";
import { Device, UserMedia } from "./VideoSettings";

const backdropGradient = `
  linear-gradient(
    rgba(0, 0, 0, 0.898) 0%,
    rgba(0, 0, 0, 0.880) 23%,
    rgba(0, 0, 0, 0.870) 55%,
    rgba(0, 0, 0, 0.860) 80%,
    rgba(0, 0, 0, 0.850) 87%,
    rgba(0, 0, 0, 0.840) 92%,
    rgba(0, 0, 0, 0.813) 100%
  );
`;

type PropTypes = {
  maxLength?: number;
  focusSubmissionForm: () => any;
  recording: RecordedFile | null;
  setRecording: (x: RecordedFile | null) => any;
};

const QUALITY = [
  {
    label: "Low - 480p, 30fps",
    width: 854,
    height: 480,
    framerate: 30,
  },
  {
    label: "Medium - 720p, 30fps",
    width: 1280,
    height: 720,
    framerate: 30,
  },
  {
    label: "High - 720p, 60fps",
    width: 1280,
    height: 720,
    framerate: 60,
  },
  {
    label: "Ultra - 1080p, 60fps",
    width: 1920,
    height: 1080,
    framerate: 60,
  },
];

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;
const DEFAULT_FRAMERATE = 30;

const VideoBanner = (props: PropTypes) => {
  const [state, setState] = useState(RecorderState.INITAL);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [userMedia, setUserMedia] = useState<UserMedia | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const changeMedia = (newUserMedia: UserMedia) => {
    setUserMedia(newUserMedia);
    if (stream) {
      setStream(null);
    }
  };

  const setVideoDevice = (videoDevice: Device) => {
    const changed = userMedia!.videoDevice?.id !== videoDevice.id;
    if (!changed) return;
    window.localStorage.setItem("defaultVideoDeviceId", videoDevice.id);
    changeMedia({
      ...userMedia!,
      videoDevice,
    });
  };

  const setAudioDevice = (audioDevice: Device) => {
    const changed = userMedia!.audioDevice?.id !== audioDevice.id;
    if (!changed) return;
    window.localStorage.setItem("defaultAudioDeviceId", audioDevice.id);
    changeMedia({
      ...userMedia!,
      audioDevice,
    });
  };

  const setQuality = (qualityIndex: number) => {
    if (qualityKey() === qualityIndex) return;
    console.log(qualityIndex);
    changeMedia({
      ...userMedia!,
      width: QUALITY[qualityIndex].width,
      height: QUALITY[qualityIndex].height,
      framerate: QUALITY[qualityIndex].framerate,
    });
  };

  // FIXME: be civilized and use lodash or something
  const qualityKey = () => {
    if (!userMedia) return 1; // default
    if (userMedia.height === 480) return 0;
    if (userMedia.height === 720 && userMedia.framerate === 30) return 1;
    if (userMedia.height === 720 && userMedia.framerate === 60) return 2;
    if (userMedia.height === 1080) return 3;
    return 1;
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setDevices(devices);
      const videoDeviceId = window.localStorage.getItem("defaultVideoDeviceId");
      const audioDeviceId = window.localStorage.getItem("defaultAudioDeviceId");

      const videoDevice = devices.find(
        videoDeviceId
          ? (d) => d.deviceId === videoDeviceId
          : (d) => d.kind === "videoinput"
      );

      const audioDevice = devices.find(
        audioDeviceId
          ? (d) => d.deviceId === audioDeviceId
          : (d) => d.kind === "audioinput"
      );

      // TODO: localstorage defaults
      setUserMedia({
        videoDevice: videoDevice
          ? {
              id: videoDevice.deviceId,
              label: videoDevice.label,
            }
          : undefined,
        audioDevice: audioDevice
          ? {
              id: audioDevice.deviceId,
              label: audioDevice.label,
            }
          : undefined,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        framerate: DEFAULT_FRAMERATE,
      });

      // once we've loaded the devices, we can see if we can instantly move onto monitoring
      navigator.permissions.query({ name: "camera" }).then((status) => {
        const permitted = status.state === "granted";
        if (permitted) {
          // go straight to monitoring
          setState(RecorderState.MONITORING);
        }
      });
    });
  }, []);

  const startMonitoring = () => {
    if (!userMedia) {
      alert("!userMedia");
      return;
    }

    if (props.recording) {
      props.setRecording(null);
    }

    if (!stream) {
      navigator.mediaDevices
        .getUserMedia({
          audio: userMedia.audioDevice
            ? {
                deviceId: userMedia.audioDevice.id,
              }
            : false,
          video: userMedia.videoDevice
            ? {
                deviceId: userMedia.videoDevice.id,
                width: userMedia.width,
                height: userMedia.height,
                frameRate: userMedia.framerate,
              }
            : false,
        })
        .then(
          (stream) => {
            console.log("stream", stream);
            setStream(stream);
          },
          (err) => {
            console.error("no stream :(", err);
            debugger;
          }
        );
    }
  };

  const startRecording = () => {
    if (!userMedia || !stream) {
      alert("!userMedia || !stream");
      return;
    }

    const mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 128 * 1000,
      videoBitsPerSecond: 1.75 * 1000 * 1000,
    });
    setMediaRecorder(mediaRecorder);

    const startedAt = new Date().getTime();
    const recordedChunks: BlobPart[] = [];
    mediaRecorder.addEventListener("dataavailable", function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    });

    mediaRecorder.addEventListener("stop", function () {
      const blob = new Blob(recordedChunks);
      props.setRecording({
        length: 0.001 * (new Date().getTime() - startedAt),
        url: URL.createObjectURL(blob),
        blob,
      });
    });

    mediaRecorder.start();
  };

  // leading edge
  useEffect(() => {
    switch (state) {
      case RecorderState.MONITORING:
        return startMonitoring();
      case RecorderState.RECORDING:
        return startRecording();
      case RecorderState.PLAYBACK:
        if (mediaRecorder) {
          mediaRecorder.stop();
          setMediaRecorder(null);
        }
        break;
    }
  }, [state]);

  useEffect(() => {
    if (stream === null && state === RecorderState.MONITORING) {
      return startMonitoring();
    }
  }, [stream]);

  return (
    <Container
      centerContent
      maxW="100%"
      p={6}
      bg={backdropGradient}
    >
      <VideoBox
        maxLength={props.maxLength}
        startRecording={() => setState(RecorderState.RECORDING)}
        stopRecording={() => setState(RecorderState.PLAYBACK)}
        startUpload={() => {}}
        state={state}
        videoStream={stream || undefined}
        videoUrl={props.recording?.url}
        requestPermission={() => setState(RecorderState.MONITORING)}
        focusSubmissionForm={props.focusSubmissionForm}
        discardRecording={() => setState(RecorderState.MONITORING)}
      />
      <Container marginTop={4}>
        <Accordion allowToggle color="white">
          <AccordionItem border={0} isDisabled={state === RecorderState.RECORDING}>
            {({ isExpanded }) => (
              <>
                <AccordionButton>
                  <Flex width="100%">
                    <Box>
                      <Text color="white" fontWeight="bold">
                        Settings
                      </Text>
                    </Box>
                    <Spacer />
                    {(!isExpanded || state === RecorderState.RECORDING) &&
                      userMedia && (
                        <Box>
                          <Tag size="sm" marginRight={2} verticalAlign="1px">
                            <TagLabel>
                              {userMedia.height}p{userMedia.framerate}
                            </TagLabel>
                          </Tag>
                          <Tag size="sm" marginRight={2} verticalAlign="-1px">
                            <TagLeftIcon boxSize="12px" as={FaVideo} />
                            <TagLabel>
                              {userMedia.videoDevice?.label || "N/A"}
                            </TagLabel>
                          </Tag>
                          <Tag size="sm" marginRight={2} verticalAlign="-1px">
                            <TagLeftIcon boxSize="12px" as={FaMicrophone} />
                            <TagLabel>
                              {userMedia.audioDevice?.label || "N/A"}
                            </TagLabel>
                          </Tag>
                        </Box>
                      )}
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>

                {state !== RecorderState.RECORDING && (
                  <AccordionPanel pb={4}>
                    <FormControl id="videoDevice" m={4} mt={0}>
                      <FormLabel>Video Device</FormLabel>
                      <Select
                        value={userMedia?.videoDevice?.id}
                        onChange={(c) =>
                          setVideoDevice({
                            id: c.target.value,
                            label:
                              c.target.options[c.target.selectedIndex]
                                .innerText,
                          })
                        }
                      >
                        {devices
                          .filter((d) => d.kind === "videoinput")
                          .map((device) => (
                            <option
                              key={device.deviceId}
                              value={device.deviceId}
                            >
                              {device.label}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
                    <FormControl id="audioDevice" m={4}>
                      <FormLabel>Audio Device</FormLabel>
                      <Select
                        value={userMedia?.audioDevice?.id}
                        onChange={(c) =>
                          setAudioDevice({
                            id: c.target.value,
                            label:
                              c.target.options[c.target.selectedIndex]
                                .innerText,
                          })
                        }
                      >
                        {devices
                          .filter((d) => d.kind === "audioinput")
                          .map((device) => (
                            <option
                              key={device.deviceId}
                              value={device.deviceId}
                            >
                              {device.label}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
                    <FormControl id="quality" m={4}>
                      <FormLabel>Quality Setting</FormLabel>
                      <Select
                        value={qualityKey()}
                        onChange={(c) => setQuality(+c.target.value)}
                      >
                        {QUALITY.map(({ label }, index) => (
                          <option key={index} value={`${index}`}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </AccordionPanel>
                )}
              </>
            )}
          </AccordionItem>
        </Accordion>
      </Container>
    </Container>
  );
};

export default VideoBanner;
