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
              type: "string",
              input: false,
              default: "user",
            } 
        }
    },


  database: mongodbAdapter(db, {
    client,
  }),
});