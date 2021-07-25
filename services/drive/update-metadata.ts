import { drive_v3 } from "googleapis";

/**
 * Updates a file's metadata properties.
 */
const updateMetadata = (drive: drive_v3.Drive) =>
  async (fileId: string, metadata: { [key: string]: string }) => {
    return drive.files.update({
      fileId,
      requestBody: {
        properties: metadata,
      }
    });
  };

export default updateMetadata;
