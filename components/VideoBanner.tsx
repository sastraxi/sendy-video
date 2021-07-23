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
import VideoBox, { RecorderState } from "./VideoBox";
import { Device, UserMedia } from "./VideoSettings";

type PropTypes = {
  maxLength?: number;
};

type RecordedFile = {
  length: number;
  blob: Blob;
  url: string;
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
  const [shouldStop, setShouldStop] = useState<boolean>(false);
  const [recording, setRecording] = useState<RecordedFile | null>(null);

  const setVideoDevice = (videoDevice: Device) => {
    setUserMedia({
      ...userMedia!,
      videoDevice,
    });
    window.localStorage.setItem("defaultVideoDeviceId", videoDevice.id);
  };

  const setAudioDevice = (audioDevice: Device) => {
    setUserMedia({
      ...userMedia!,
      audioDevice,
    });
    window.localStorage.setItem("defaultAudioDeviceId", audioDevice.id);
  };

  const setQuality = (qualityIndex: number) => {
    setUserMedia({
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
  };

  const startRecording = () => {
    if (!userMedia || !stream) {
      alert("!userMedia || !stream");
      return;
    }

    const mediaRecorder = new MediaRecorder(stream, {
      audioBitsPerSecond: 128 * 1000,
      videoBitsPerSecond: 1.75 * 1000 * 1000,
      mimeType: "video/mp4",
    });

    const startedAt = new Date().getTime();
    const recordedChunks: BlobPart[] = [];
    mediaRecorder.addEventListener("dataavailable", function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }

      if (shouldStop && state === RecorderState.RECORDING) {
        mediaRecorder.stop();
        setState(RecorderState.STOPPED);
      }
    });

    mediaRecorder.addEventListener("stop", function () {
      const blob = new Blob(recordedChunks);
      setRecording({
        length: 0.001 * (new Date().getTime() - startedAt),
        url: URL.createObjectURL(blob),
        blob,
      });
    });

    mediaRecorder.start();
  };

  useEffect(() => {
    switch (state) {
      case RecorderState.MONITORING:
        return startMonitoring();
      case RecorderState.RECORDING:
        return startRecording();
      case RecorderState.STOPPED:
        break;
      case RecorderState.PLAYBACK:
        break;
    }
  }, [state]);

  return (
    <Container
      centerContent
      maxW="100%"
      p={6}
      bgGradient="linear(to-b, blue.600, gray.700)"
    >
      <VideoBox
        maxLength={props.maxLength}
        startRecording={startRecording}
        startUpload={() => {}}
        state={state}
        videoStream={stream || undefined}
        requestPermission={startMonitoring}
      />
      <Container marginTop={4}>
        <Accordion allowToggle color="white">
          <AccordionItem isDisabled={state === RecorderState.RECORDING}>
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
                    {(!isExpanded || state === RecorderState.RECORDING) && userMedia && (
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

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text color="white" fontWeight="bold">
                    Need help?
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                Let&apos;s record a message using your laptop or PC&apos;s
                webcam! You can also upload previously-recorded video files, as
                well as recording your screen (if your browser supports it).
              </Text>
              <Text marginTop={3}>
                First, let&apos;s make sure your browser can connect to your
                camera. Click <Code>Settings</Code> above, and cycle through{" "}
                <em>video devices</em> until you can see yourself above the{" "}
                <Code>Record</Code> and <Code>Upload</Code> buttons. Next, cycle
                through the <em>audio devices</em> until you can see the meter
                respond to your voice.
              </Text>
              <Text marginTop={3}>
                Next, scroll down to see the instructions your project owner has
                given. Often, the difference between an <em>okay</em> video and
                a good one is in just a few minutes of prep: about 5 for each
                minute you want your submission to be in length. Put down on
                paper a few points to get to in each minute, and keep yourself
                on schedule. Try to reduce your
              </Text>
              <Text marginTop={3}>
                Once you click the <Code>Record</Code> button, the user
                interface will change to show a <Code>Stop</Code> button.
                You&apos;ll see a timer you can use to keep your pace,
                and&mdash;if the project owner has set a time limit&mdash;you
                will see a countdown timer as well. Once you press the{" "}
                <Code>Stop</Code> button, you can either choose to continue to
                submission, or scrap your recording and try again.
              </Text>
              <Text marginTop={3}>
                When you have perfected your video, it&apos;s time for
                submission. Scroll to the bottom of the page and fill in the
                metadata fields that the project owner has requested, then click{" "}
                <Code>Submit my video</Code>.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text color="white" fontWeight="bold">
                    How we keep your data private
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                While you are recording a video, none of that video or audio
                data is being sent to our servers, nor is it sent to any other
                server. You can confirm this using the developer tools of your
                browser and looking in the Network or Requests tab.
              </Text>
              <Text marginTop={3}>
                After you finish a recording or upload a video, we generate a
                Google Drive URL using the project owner&apos;s credentials,
                then send your audio and video data <em>directly</em> to Google
                from your browser, bypassing our servers entirely.
              </Text>
              <Heading fontSize="100%" marginTop={6}>
                What do we store?
              </Heading>
              <Text marginTop={5}>
                Your IP address is logged, as well as your email address (only
                if you are logged in). The metadata you have shared will be
                attached to the uploaded video in Drive as well as being stored
                in our database.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
    </Container>
  );
};

export default VideoBanner;
