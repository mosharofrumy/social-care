import { APIError, betterAuth } from "better-auth";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
export const db = client.db("socialcare");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    password: {
      hash: async (password) => {
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must include at least one uppercase and one lowercase letter.",
          });
        }
        return hashPassword(password);
      },
      verify: verifyPassword,
    },
  },
  plugins: [
    jwt({
      session: {
        cookieCache: {
          enabled: true,
          strategy: "JWT",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        },
      },

      jwt: {
        audience: "social-care-api",
      },
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET as string,
    },
  },
});
