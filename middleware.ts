import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const publicRoutes = ["/", "/login", "/signup"];

  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const url = `${
      apiUrl?.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl
    }/users/checkUser`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        // Forward incoming cookies to the API so it can validate the session
        Cookie: request.headers.get("cookie") || "",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const data = await res.json().catch(() => null);
    const isValid =
      data?.isValid ??
      data?.data?.isValid ??
      Boolean(data?.user || data?.data?.user);

    if (!isValid) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth check failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/my-profile", "/profile/:path*"],
};
