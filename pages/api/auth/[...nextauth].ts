import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import {
  createGoogleProvider, PROVIDER_ID as GOOGLE_PROVIDER_ID, refreshAccessToken, SEC_TO_MS
} from '../../../services/drive';
import prisma from '../../../utils/db';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  providers: [
    createGoogleProvider(),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: false,

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async signIn(user, account, profile) {
      console.log('signed in with account', profile, account);
      if (!user.email) {
        console.error('Tried to sign in with user without an email', user);
        return false;
      }
    
      // this is pretty ugly, but necessary
      // https://github.com/nextauthjs/adapters/issues/48
      const { expires_in, accessToken } = account;
      const expiresAt = expires_in ? new Date(
        Date.now() + expires_in! * SEC_TO_MS
      ) : undefined;
      await prisma.accessToken.upsert({
        where: { token: accessToken },
        update: { expiresAt },
        create: {
          token: accessToken,
          expiresAt,
        },
      });

      return true;
    },
    // async redirect(url, baseUrl) { return baseUrl },
    async session(session, user) {
      const dbUser = await prisma.user.findUnique({
        where: {
          email: session!.user!.email!,
        },
        include: {
          accounts: true,
        },
      });
      const googleAccount = dbUser?.accounts.find(
        (a) => a.providerId === GOOGLE_PROVIDER_ID,
      );
      const accessToken = await prisma.accessToken.findUnique({
        where: {
          token: googleAccount?.accessToken!,
        },
      });

      if (googleAccount && googleAccount.refreshToken && accessToken!.expiresAt && accessToken!.expiresAt.valueOf() < Date.now()) {
        try {
          const refreshedToken = await refreshAccessToken(googleAccount);
          if (!refreshedToken.error) {
            await Promise.all([
              prisma.accessToken.delete({ where: { token: googleAccount.accessToken! }}),
              prisma.accessToken.create({
                data: {
                  token: refreshedToken.accessToken,
                  expiresAt: refreshedToken.accessTokenExpires, 
                },
              }),
            ]);
          } else {
            console.warn('Not updating accessToken table as refresh failed', refreshedToken);
          }
          return {
            ...session,
            google: {
              ...googleAccount,
              ...refreshedToken,
            },
          };
        } catch (error) {
          return {
            ...session,
            google: { ...googleAccount, couldNotRefreshToken: true },
          };
        }
      }

      return {
        ...session,
        google: googleAccount,
      };
    },
    // async jwt(token, user, account, profile, isNewUser) { return token }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // Enable debug messages in the console if you are having problems
  debug: false,
});
