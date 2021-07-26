import { Account } from "@prisma/client";
import "next-auth";

declare global {
  module "next-auth" {
    interface Session {
      google?: Account & {
        couldNotRefreshToken?: boolean,
      },
    }
  }
}
