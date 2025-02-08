import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import db from "./ConnectToDB";
import { userSchema } from "@/db/userSchema";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const existUser = await db
          .select()
          .from(userSchema)
          .where(eq(userSchema.email, credentials.email));

        if (!existUser.length) {
          throw new Error("Invalid email");
        }

        const validPassword = bcrypt.compareSync(
          credentials.password,
          existUser[0].password
        );

        if (!validPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: existUser[0].id.toString(),
          name: existUser[0].name,
          email: existUser[0].email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};
