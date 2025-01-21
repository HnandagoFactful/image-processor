import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

export default createMiddleware(routing);

export function middleware() {
  return NextResponse.next()

}

export const config = {
  matcher: ["/", "/(es|en)/:path*"], // At this line, define into the matcher all the availables language you have defined into routing.ts
};