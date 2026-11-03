import { betterAuth } from "better-auth";
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
  }, 
  plugins: [
    jwt({
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
