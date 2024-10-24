import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth";

export const authOptions: AuthOptions = {
  theme: {
    brandColor: "#5A287F",
    logo: "/ariadne_logo.svg",
    colorScheme: "dark",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials?.password || !credentials?.email) {
          return null;
        }
        const { email, password } = credentials;
        if (
          !email.includes("@ariadne.inc") ||
          password !== process.env.DEFAULT_PASSWORD
        ) {
          return null;
        }
        return {
          id: `${new Date().getTime()}`,
          email: credentials.email,
          name: "Admin",
        };
      },
    }),
  ],
};

export default function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
