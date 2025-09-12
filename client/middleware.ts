import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
// import { auth } from "./lib/auth";
// import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    // const session = await auth.api.getSession({
    // 	headers: await headers(),
    // });

    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

  
}

export const config = {
    matcher: [ "/admin"], // Specify the routes the middleware applies to
};
