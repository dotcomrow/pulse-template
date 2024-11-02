import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { default as Constants } from "@utils/constants";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    if (pathname === "/") {
        if (req.cookies.get("token")) {
            // redirect to dashboard if logged in
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        } else {
            // redirect to home if not logged in
            return NextResponse.redirect(new URL("/map", req.nextUrl));
        }
    }
    if (Constants.securePaths.includes(pathname) && !req.cookies.get("token")) {
        // Redirect to home if not authenticated
        return NextResponse.redirect(new URL("/map", req.nextUrl));
    }
    return NextResponse.next();
}