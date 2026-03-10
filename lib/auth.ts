import { betterAuth, BetterAuthOptions } from "better-auth";
import { bearer } from "better-auth/plugins";
import { pool } from "./db";

export const authOptions = {
    database: pool,

    user: { 
        modelName: "users",
        additionalFields: {
            active: {
                type: "boolean",
            },
        },
    },
    session: { 
        modelName: "sessions",
    },
    account: { modelName: "accounts" },
    verification: { modelName: "verifications" },

    emailAndPassword: {
        enabled: true,
    },

    plugins: [
        bearer(),
    ],

    // ✅ Hardcoded secret fallback using ||
    secret: process.env.BETTER_AUTH_SECRET || "NzhkM2Y5ZTJmYjYwM2M0YmU4YjA1ODcyM2M1YjY5NDA3ZDAyM2M1ZTg5M2Y0YjU2YmU4YjA1ODcyM2M1YjY5NDA3ZDAyM2M1ZTg5M2Y0YjU2",

    // ✅ Base URL for serverless / production fallback
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000", 

    trustedOrigins: [
        "http://localhost:3000",
        "https://basicnextapp-six.vercel.app",
    ],

    // advanced: {
    //     trustHost: true, // Important for Vercel proxy headers
    // },
} satisfies BetterAuthOptions;

export const auth = betterAuth(authOptions);

export type Auth = typeof auth;
export type AuthOptions = typeof authOptions;