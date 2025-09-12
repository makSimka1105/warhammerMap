import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma";
import { Resend } from "resend";
import VerifyEmail from "@/components/auth/verify-email";

const resend = new Resend(process.env.RESEND_API_KEY as string);
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const ADMIN_EMAILS =
                        process.env.ADMIN_EMAILS?.split(";") ?? [];

                    if (ADMIN_EMAILS.includes(user.email)) {
                        return { data: { ...user, role: "ADMIN" } };
                    }

                    return { data: user };
                },
            },
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        expiresIn: 60 * 60,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            resend.emails.send({
                from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                to: [user.email as string],
                subject: "Verify your email",
                react: VerifyEmail({ username: user.name, verifyUrl:url }),
            });
            console.log("email sended TO " + user.email);
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    user: {
        additionalFields: {
            role: {
                type: ["USER", "ADMIN"],
                input: false,
            },
        },
    },

    session: {
        expiresIn: 60 * 60 * 24, // 1 days
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24,
        },
    },

    plugins: [
        nextCookies(),
        admin({
            defaultRole: "USER",
            adminRoles: ["ADMIN"],
        }),
    ],
});
