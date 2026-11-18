import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.DB_URI!);
const db = client.db('gear-vault');

export const auth = betterAuth({

     emailAndPassword: { 
    enabled: true, 
  },
 user: {
       additionalFields: {
          role: {
              type: ["customer", "admin",'owner'],
              input: false,
              defaultValue: "customer",
            } 
        }
    },
socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

  database: mongodbAdapter(db, {
    client,
  }),
});