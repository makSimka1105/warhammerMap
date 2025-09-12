import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import type { auth } from "./auth";
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
    //you can pass client configuration here
    // baseURL: "http://localhost:3000"
    plugins: [
        inferAdditionalFields<typeof auth>(),
        adminClient(),
    ],
});

export const signIn = async (email: string, password: string) => {
    try {
        await authClient.signIn.email({
            email,
            password,
        });
        console.log("Signed in successfully.")

        return {
            success: true,
            message: "Signed in successfully."
        }
    } catch (error) {
        const e = error as Error
        console.log(e)
        

        return {
            success: false,
            message: e.message || "An unknown error occurred."
        }
    }
}
export const signUp = async (name:string,email: string, password: string) => {
    try {
        await authClient.signUp.email({
            name,
            email,
            password,
        });
        console.log("Signed up successfully.");

        return {
            success: true,
            message: "Signed up successfully.",
        };
    } catch (error) {
        const e = error as Error;
        console.log(e);

        return {
            success: false,
            message: e.message || "An unknown error occurred.",
        };
    }
};