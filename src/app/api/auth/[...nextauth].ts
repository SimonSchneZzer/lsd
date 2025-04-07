import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: {
        appleId: process.env.APPLE_ID!, // Falls benötigt, je nach Konfiguration
        teamId: process.env.APPLE_TEAM_ID!,
        // Apple erwartet, dass Zeilenumbrüche in privaten Schlüsseln korrekt formatiert sind
        privateKey: process.env.APPLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        keyId: process.env.APPLE_KEY_ID!
      }
    }),
    // Optional: Behalte deinen CredentialsProvider, falls du auch Login per E-Mail/Passwort anbieten möchtest
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (user && user.password === credentials?.password) {
          return user;
        }
        return null;
      },
    }),
  ],
  // Weitere NextAuth-Optionen, z.B. Callbacks, Session-Strategie etc.
});
