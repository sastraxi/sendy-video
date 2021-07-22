import { VideoHTMLAttributes, useCallback } from "react";

type VideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject?: MediaStream;
};

const Video = ({ srcObject, ...props }: VideoProps) => {
  const refVideo = useCallback(
    (node: HTMLVideoElement) => {
      if (node && srcObject) node.srcObject = srcObject;
    },
    [srcObject],
  );

  return <video ref={refVideo} {...props} />;
};

export default Video;
