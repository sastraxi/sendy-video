import { Box, Heading, Text, Code } from "@chakra-ui/react";

const HelpContent = () => (
  <Box>
    <Heading size="sm">Getting started (1 minute)</Heading>
    <Text marginTop={3}>
      Let&apos;s record a message using your laptop or PC&apos;s webcam! You can
      also upload previously-recorded video files, as well as recording your
      screen (if your browser supports it).
    </Text>
    <Text marginTop={3}>
      First, let&apos;s make sure your browser can connect to your camera. Click{" "}
      <Code>Settings</Code> above, and cycle through <em>video devices</em>{" "}
      until you can see yourself above the <Code>Record</Code> and{" "}
      <Code>Upload</Code> buttons. Next, cycle through the{" "}
      <em>audio devices</em> until you can see the meter respond to your voice.
    </Text>
    <Text marginTop={3}>
      Next, scroll down to see the instructions your project owner has given.
      Often, the difference between an <em>okay</em> video and a good one is in
      just a few minutes of prep: about 5 for each minute you want your
      submission to be in length. Put down on paper a few points to get to in
      each minute, and keep yourself on schedule.
    </Text>
    <Text marginTop={3}>
      Once you click the <Code>Record</Code> button, the user interface will
      change to show a <Code>Stop</Code> button. You&apos;ll see a timer you can
      use to keep your pace, and&mdash;if the project owner has set a time
      limit&mdash;you will see a countdown timer as well. Once you press the{" "}
      <Code>Stop</Code> button, you can either choose to continue to submission,
      or scrap your recording and try again.
    </Text>
    <Text marginTop={3}>
      When you have perfected your video, it&apos;s time for submission. Scroll
      to the bottom of the page and fill in the metadata fields that the project
      owner has requested, then click <Code>Submit my video</Code>.
    </Text>

    <Heading size="sm" mt={8}>How we keep your data private</Heading>
    <Text marginTop={3}>
      While you are recording a video, none of that video or audio data is being
      sent to our servers, nor is it sent to any other server. You can confirm
      this using the developer tools of your browser and looking in the Network
      or Requests tab.
    </Text>
    <Text marginTop={3}>
      After you finish a recording or upload a video, we generate a Google Drive
      URL using the project owner&apos;s credentials, then send your audio and
      video data <em>directly</em> to Google from your browser, bypassing our
      servers entirely.
    </Text>
    <Heading size="sm" mt={8}>What do we store?</Heading>
    <Text marginTop={5}>
      Your IP address is logged, as well as your email address (only if you are
      logged in). The metadata you have shared will be attached to the uploaded
      video in Drive as well as being stored in our database.
    </Text>
  </Box>
);

export default HelpContent;
