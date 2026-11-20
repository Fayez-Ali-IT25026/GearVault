import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins"


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
              // input: true lets the register form send a role.
              input: true,
              defaultValue: "customer",
            } 
        }
    },
    // A new user can only become "customer" or "owner".
    // If someone sends "admin", we save "customer" instead.
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const role = user.role === "owner" ? "owner" : "customer";
            return { data: { ...user, role } };
          },
        },
      },
    },
socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

     plugins: [
        jwt(), 
    ],
     session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    }
  },

  database: mongodbAdapter(db, {
    client,
  }),
});