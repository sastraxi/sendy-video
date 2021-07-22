import {
  Box,
  Code,
  Flex,
  Spacer,
  Text,
  Tag,
  TagLabel,
  TagLeftIcon,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
} from "@chakra-ui/react";
import { useEffect } from "react";

import { FaMicrophone, FaVideo } from "react-icons/fa";
import VideoBox, { RecorderState } from "./VideoBox";

type PropTypes = {
  maxLength?: number;
};

const VideoBanner = (props: PropTypes) => {
  return (
    <Container
      centerContent
      maxW="100%"
      p={6}
      bgGradient="linear(to-b, blue.600, gray.700)"
    >
      <VideoBox
        maxLength={props.maxLength}
        startRecording={() => {}}
        startUpload={() => {}}
        state={RecorderState.INITIAL}
      />
      <Container marginTop={4}>
        <Accordion allowToggle color="white">
          <AccordionItem>
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
                    {!isExpanded && (
                      <Box>
                        <Tag size="sm" marginRight={2} verticalAlign="1px">
                          <TagLabel>720p60</TagLabel>
                        </Tag>
                        <Tag size="sm" marginRight={2} verticalAlign="-1px">
                          <TagLeftIcon boxSize="12px" as={FaVideo} />
                          <TagLabel>Built-in webcam</TagLabel>
                        </Tag>
                        <Tag size="sm" marginRight={2} verticalAlign="-1px">
                          <TagLeftIcon boxSize="12px" as={FaMicrophone} />
                          <TagLabel>Built-in microphone</TagLabel>
                        </Tag>
                      </Box>
                    )}
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
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
                metadata fields that the project owner has requested, then
                click <Code>Submit my video</Code>.
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
