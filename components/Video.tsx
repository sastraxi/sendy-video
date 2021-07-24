import styled from '@emotion/styled';
import { VideoHTMLAttributes, useCallback } from "react";

const FancyVideo = styled.video<{ mirror?: boolean }>`
  border-radius: 4px;
  transform: scaleX(${props => props.mirror ? -1  : 1});
`;

type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject?: MediaStream;
  mirror?: boolean;
};

const Video = ({ srcObject, ...props }: VideoProps) => {
  const refVideo = useCallback(
    (node: HTMLVideoElement) => {
      if (node && srcObject) node.srcObject = srcObject;
    },
    [srcObject],
  );

  return <FancyVideo ref={refVideo} {...props} />;
};

export default Video;
