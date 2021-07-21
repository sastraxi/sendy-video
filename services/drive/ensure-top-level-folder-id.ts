import { User } from "@prisma/client";
import { drive_v3 } from "googleapis";
import prisma from "../../utils/db";

const TOP_LEVEL_FOLDER_NAME = 'Sendy Projects';

/**
 * Returns the ID of the top-level folder where we can store projects
 * in the given user's Drive. Creates the folder if it does not already
 * exist.
 */
const ensureTopLevelFolderId = (user: User, drive: drive_v3.Drive) => async () => {
  if (!user.rootFileId) {
    const response = await drive.files.create({
      requestBody: {
          name: TOP_LEVEL_FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });
    console.log('created top-level folder', response);
    const rootFileId = response.data.id!;
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        rootFileId,
      },
    });
    // N.B.: update the POJO so other methods on this request can access this id
    user.rootFileId = rootFileId;
  }
  return user.rootFileId;
};

export default ensureTopLevelFolderId;
