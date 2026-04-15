import { NextResponse } from "next/server";

// Demo build: no auth gates. The frontend AuthProvider auto-authenticates
// every visitor as Sally, so all routes are reachable without cookies.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
