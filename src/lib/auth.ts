
import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
});

export const auth = betterAuth({
  appName: "BazarDor",

  baseURL:
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000",

  database: pool,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: false,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});

export default auth;
