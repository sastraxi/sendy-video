export type ProjectFormData = {
  name: string;
  markdown?: string;
  isOpen: boolean;
  ssoEnforced: boolean;
  ssoMaxSubmissions?: number;
  ssoSharedVideos: boolean;
  ssoDomain?: string;
  limitSubmissions?: number;
  limitTotalSize?: number;
};

export type SubmissionFormData = {
  magicCode: string,
  mimeType?: string,
  fileSize?: number,
  email?: string,
  title?: string,
};

export type RecordedFile = {
  length: number;
  blob: Blob;
  url: string;
  mimeType: string;
};
