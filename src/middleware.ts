import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED = ["/dashboard", "/salas"]
const AUTH_ROUTES = ["/login", "/registro"]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isAuthed = Boolean(request.cookies.get("sugi_auth")?.value)

    const isProtected = PROTECTED.some((p) => pathname.startsWith(p))
    const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p))

    if (isProtected && !isAuthed) {
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        url.searchParams.set("next", pathname)
        return NextResponse.redirect(url)
    }

    if (isAuthRoute && isAuthed) {
        const url = request.nextUrl.clone()
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/salas/:path*", "/login", "/registro"],
}
