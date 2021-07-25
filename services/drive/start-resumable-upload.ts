import axios from 'axios';
import { User } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";

/**
 * Starts a resumable upload in Drive.
 * @requires the proper MIME type and content length of the file to be uploaded.
 * @returns the resumable upload URI, which can be shipped to a front-end.
 */
const startResumableUpload = (client: OAuth2Client) =>
  async (
    parentFileId: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
  ) => {
    // https://stackoverflow.com/a/40051252/220642
    const response = await axios.post(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      {
        name: fileName,
        parents: [parentFileId],
      },
      {
        headers: {
          "Authorization": `Bearer ${(await client.getAccessToken()).token}`,
          "X-Upload-Content-Type": mimeType,
          "X-Upload-Content-Length": `${fileSize}`,
          "Content-Type": "application/json; charset=UTF-8",
          "Origin": process.env.NEXTAUTH_URL, // FIXME: shouldn't reference nextauth here
        },
      },
    );
    console.log('started multipart upload', response);
    return {
      resumableUrl: response.headers.location,
      fileId: response.headers['x-guploader-uploadid'],
    };
  };

export default startResumableUpload;
