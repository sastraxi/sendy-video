import { Account, User } from '@prisma/client';
import { google } from 'googleapis';
import Providers from "next-auth/providers";
import prisma from "../../utils/db";
import createFolder from './create-folder';

import ensureTopLevelFolderId from './ensure-top-level-folder-id';
import startResumableUpload from './start-resumable-upload';

const PROVIDER_ID = 'google';
const CLIENT_ID = process.env.GOOGLE_ID;
const CLIENT_SECRET = process.env.GOOGLE_SECRET;

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.file',
];
const SCOPES_STRING = SCOPES.join(' ');

export const createGoogleProvider = () =>
  Providers.Google({
    id: PROVIDER_ID,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    scope: SCOPES_STRING,
  });

const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;

/**
 * Main access point for this API. Returns an object with a bunch of
 * utility functions you can call directly. If no Account is provided,
 * it will be looked up. Calling this function with a non-Google account
 * will reject.
 */
export const createClient = async (user: User, account?: Account) => {
  if (typeof window !== 'undefined') {
    throw new Error('This service can only be used on the backend.');
  }

  if (account && account.providerId !== PROVIDER_ID) {
    console.error(`Account provided was not a ${PROVIDER_ID} account.`, account);
    throw new Error(`Account provided was not a ${PROVIDER_ID} account.`);
  }

  const acct = account || await prisma.account.findUnique({
    rejectOnNotFound: true,
    where: {
      providerId_userId: {
        providerId: PROVIDER_ID,
        userId: user.id,
      },
    },
  });

  const client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  client.setCredentials({
    access_token: acct.accessToken,
    refresh_token: acct.refreshToken || undefined,
    expiry_date: acct.accessTokenExpires?.valueOf() || undefined,
    scope: SCOPES_STRING,
  });
  const drive = google.drive({ version: 'v3', auth: client });

  return {
    ensureTopLevelFolderId: ensureTopLevelFolderId(user, drive),
    createFolder: createFolder(user, drive),
    startResumableUpload: startResumableUpload(user, client),
  };
};
