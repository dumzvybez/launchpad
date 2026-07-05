// v5.85 fix (5.7/10.1): proper health-check endpoint.
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "launchpad-api",
    version: "5.85.0",
  });
}
