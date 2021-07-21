import styled from "@emotion/styled";
import {
  Box,
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
} from "@chakra-ui/react";

import { FaMicrophone, FaVideo } from "react-icons/fa";

type PropTypes = {
  maxLength?: number;
};

const Video = styled.div`
  width: 800px;
  height: 454px;
  background: black;
  border-radius: 4px;
`;

const VideoBanner = (props: PropTypes) => {
  return (
    <Container
      centerContent
      maxW="100%"
      p={6}
      bgGradient="linear(to-b, blue.600, gray.700)"
    >
      <Video />
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
                    Upload a video instead
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
    </Container>
  );
};

export default VideoBanner;
