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