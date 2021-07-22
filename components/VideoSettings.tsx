export type Device = {
  id: string,
  label: string,
};

export type UserMedia = {
  videoDevice?: Device,
  audioDevice?: Device,
  width: number,
  height: number,
  framerate: number,
};

const VideoSettings = (props: any) => {
  
};

export default VideoSettings;
