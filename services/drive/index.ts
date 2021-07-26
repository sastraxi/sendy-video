import { Account, User } from "@prisma/client";
import axios from "axios";
import { google } from "googleapis";
import { TokenSet } from "next-auth";
import Providers from "next-auth/providers";
import prisma from "../../utils/db";
import createFolder from "./create-folder";
import ensureTopLevelFolderId from "./ensure-top-level-folder-id";
import getWebLink from "./get-web-link";
import makePublicWithLink from "./make-public-with-link";
import shareWithUser from "./share-with-user";
import startResumableUpload from "./start-resumable-upload";
import updateMetadata from "./update-metadata";

export const PROVIDER_ID = "google";
const CLIENT_ID = process.env.GOOGLE_ID!;
const CLIENT_SECRET = process.env.GOOGLE_SECRET!;

export const SEC_TO_MS = 1000;

const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/drive.file",
];
const SCOPES_STRING = SCOPES.join(" ");

export const createGoogleProvider = () =>
  Providers.Google({
    id: PROVIDER_ID,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    scope: SCOPES_STRING,
    authorizationUrl:
      "https://accounts.google.com/o/oauth2/auth?response_type=code&access_type=offline",
  });

const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;

type RefreshedToken = {
  accessToken: string;
  accessTokenExpires: Date;
  refreshToken?: string;
  error?: string;
};

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
export const refreshAccessToken = async (
  token: Account
): Promise<RefreshedToken> => {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      });

    const response = await axios.post(url, undefined, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const refreshedToken = (await response.data) as TokenSet;
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: new Date(
        Date.now() + refreshedToken.expires_in! * SEC_TO_MS
      ),
      refreshToken: refreshedToken.refresh_token,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Main access point for this API. Returns an object with a bunch of
 * utility functions you can call directly. If no Account is provided,
 * it will be looked up. Calling this function with a non-Google account
 * will reject.
 */
export const createDriveClient = async (user: User, account?: Account) => {
  if (typeof window !== "undefined") {
    throw new Error("This service can only be used on the backend.");
  }

  if (account && account.providerId !== PROVIDER_ID) {
    console.error(
      `Account provided was not a ${PROVIDER_ID} account.`,
      account
    );
    throw new Error(`Account provided was not a ${PROVIDER_ID} account.`);
  }

  const acct =
    account ||
    (await prisma.account.findUnique({
      rejectOnNotFound: true,
      where: {
        providerId_userId: {
          providerId: PROVIDER_ID,
          userId: user.id,
        },
      },
    }));

  const client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  client.setCredentials({
    access_token: acct.accessToken,
    // XXX: we probably don't want this client refreshing
    // refresh_token: acct.refreshToken || undefined,
    // expiry_date: acct.accessTokenExpires?.valueOf() || undefined,
    scope: SCOPES_STRING,
  });
  const drive = google.drive({ version: "v3", auth: client });

  return {
    ensureTopLevelFolderId: ensureTopLevelFolderId(user, drive),
    createFolder: createFolder(user, drive),
    startResumableUpload: startResumableUpload(client),
    getWebLink: getWebLink(user, drive),
    makePublicWithLink: makePublicWithLink(drive),
    shareWithUser: shareWithUser(drive),
    updateMetadata: updateMetadata(drive),
  };
};
