import { NextResponse, userAgent } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'

import { default as Constants } from "@utils/constants";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
    const { device } = userAgent(req)
    const { pathname } = req.nextUrl;
    if (pathname === "/") {
        if (req.cookies.get("token")) {
            // redirect to dashboard if logged in
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        } else {
            // redirect to map if not logged in on desktop, on mobile needs to go to /requests
            if (device.type === 'mobile') {
                return NextResponse.redirect(new URL("/requests", req.nextUrl));
            } else {
                return NextResponse.redirect(new URL("/map", req.nextUrl));
            }
        }
    }
    if (Constants.securePaths.includes(pathname) && !req.cookies.get("token")) {
        // Redirect to map if not authenticated, else /requests on mobile
        if (device.type === 'mobile') {
            return NextResponse.redirect(new URL("/requests", req.nextUrl));
        } else {
            return NextResponse.redirect(new URL("/map", req.nextUrl));
        }
    }
    return NextResponse.next();
}