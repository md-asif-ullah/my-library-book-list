import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    if (pathname === "/" && token) {
      return NextResponse.redirect(new URL("/book", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname === "/") {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/:path*"],
};
