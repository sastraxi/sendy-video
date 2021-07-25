import { User } from "@prisma/client";
import { drive_v3 } from "googleapis";

/**
 * Privately [share / remove] access to a file [with / from] an email
 * address representing a Google account.
 */
const shareWithUser = (drive: drive_v3.Drive) =>
  async (fileId: string, email: string, allow: boolean = true): Promise<boolean> => {
    if (allow) {
      const response = await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'user',
          emailAddress: email,
        },
      });
      console.log('shared with user', response.data);
      return true;
    } else {
      // XXX: assumes there is a permission to find.
      const response = await drive.permissions.list({ fileId });
      const { permissions } = response.data;
      const permission = permissions?.find(
        p => p.role === 'reader' && 
        p.type === 'user' &&
        p.emailAddress === email
      );
      if (!permission) return false;
      await drive.permissions.delete({
        fileId,
        permissionId: permission.id!,
      });
      return true;
    }
  };

export default shareWithUser;
