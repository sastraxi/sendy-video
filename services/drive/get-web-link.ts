import { User } from "@prisma/client";
import { drive_v3 } from "googleapis";

/**
 * Gets a web link to a file the given user has access to.
 */
const getWebLink = (user: User, drive: drive_v3.Drive) =>
  async (fileId: string) => {
    const response = await drive.files.get({
      fileId,
      fields: 'webViewLink',
    });
    console.log('web link', response.data.webViewLink);
    return response.data.webViewLink!;
  };

export default getWebLink;
