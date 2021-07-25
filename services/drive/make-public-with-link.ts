import { User } from "@prisma/client";
import { drive_v3 } from "googleapis";

/**
 * Allow / disallow public access to a file if a user has a link to it.
 * (i.e. "anyone with the link can view" permission on Drive)
 */
const makePublicWithLink = (drive: drive_v3.Drive) =>
  async (fileId: string, allow: boolean): Promise<boolean> => {
    if (allow) {
      const response = await drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
          allowFileDiscovery: false,
        },
      });
      console.log('created public link permission', response.data);
      return true;
    } else {
      // XXX: assumes there is a permission to find.
      const response = await drive.permissions.list({ fileId });
      const { permissions } = response.data;
      const permission = permissions?.find(p => p.role === 'reader' && p.type === 'anyone' && !p.allowFileDiscovery);
      if (!permission) return false;
      await drive.permissions.delete({
        fileId,
        permissionId: permission.id!,
      });
      return true;
    }
  };

export default makePublicWithLink;
