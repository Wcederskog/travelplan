import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const protectedRoutes = [
  "get-groups",
  "get-destinations",
  "get-users",
  "delete-group",
  "create-group",
  "update-group",
  "create-destination",
  "update-destination",
  "delete-destination",
];

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/auth/logout") {
    request.cookies.delete("token");
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("token");
    return response;
  }
  const isProtected = protectedRoutes.includes(
    request.nextUrl.pathname.split("/api/")[1]
  );
  const token = request.cookies.get("token");
  //return unathorized if token is not present
  if (!token && isProtected)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!token) return NextResponse.next({ request });

  try {
    const { payload } = await jose.jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET || "defaultSecret")
    );

    if (isProtected && Date.now() > payload.exp! * 1000) {
      request.cookies.delete("token");
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("token");
      return response;
    }

    const headers = new Headers(request.headers);
    headers.set("user_id", payload.id as string);
    return NextResponse.next({
      request: {
        headers,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
