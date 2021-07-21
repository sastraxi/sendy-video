import { User } from "@prisma/client";
import { drive_v3 } from "googleapis";

/**
 * Creates a folder in our top-level folder.
 * @requires user.driveFileId exists.
 * @returns the file ID of the new folder in Drive.
 */
const createFolder = (user: User, drive: drive_v3.Drive) =>
  async (folderName: string) => {
    const response = await drive.files.create({
      requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [user.rootFileId!], // TODO: call ensuretoplevelfolderid
      },
      fields: ['id', 'webViewLink'].join(', '),
    });
    console.log('created folder', response);
    return {
      id: response.data.id!,
      webLink: response.data.webViewLink!,
    };
  };

export default createFolder;
