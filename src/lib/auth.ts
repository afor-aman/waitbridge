//TODO: Apply rate limit for production

import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { schema } from '@/db/schema';

export const auth = betterAuth({
    rateLimit: {
        enabled: true,
        //Work for all routes except for the ones mentioned below in customRules
        window: 200, // time window in seconds
        max: 1, // max requests in the window
        storage: 'database',
        modelName: 'rateLimit', //optional by default "rateLimit" is used
        customRules: {
            // Skip the rate limit for the get-session route
            '/get-session': false,

            '/sign-in/email': {
                //Work for the sign-in/email route only
                window: 100,
                max: 10,
            },
            '/sign-up/email': {
                //Work for the sign-up/email route only
                window: 100,
                max: 1,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: false,
    },
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: schema,
    }),
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    plugins: [jwt(), nextCookies()],
});
