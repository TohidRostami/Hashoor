import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/lib/db";
import { sendOtpSms } from "@/lib/sms";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  // Admin toggles which of these two the storefront actually shows —
  // both stay configured here either way. See lib/queries/settings.ts.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        input: false, // never settable from the public sign-up request
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
  },

  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      allowedAttempts: 3,
      sendOTP: ({ phoneNumber, code }) => {
        // Fire-and-forget on purpose — awaiting the SMS call here would
        // slow down the response and can open a timing side-channel
        // (Better Auth's own recommendation).
        void sendOtpSms(phoneNumber, code);
      },
      signUpOnVerification: {
        // Better Auth's core user model requires an email; people who
        // sign up via phone get a non-routable placeholder they never
        // see, and can add a real email later from their account page.
        getTempEmail: (phoneNumber) => `${phoneNumber.replace(/[^\d]/g, "")}@hashor-phone.local`,
        getTempName: (phoneNumber) => phoneNumber,
      },
    }),
    nextCookies(), // must stay last — see Better Auth's Next.js integration docs
  ],
});

export type Session = typeof auth.$Infer.Session;
