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
      fields: 'id',
    });
    console.log('created folder', response);
    return response.data.id!;
  };

export default createFolder;
