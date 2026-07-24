// v5.85 fix (5.7/10.1): proper health-check endpoint.
// v5.865 fix (B.13): version bumped to match package.json.
// v6.006: version synced to package.json (was stale at 5.922.0).
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "launchpad-api",
    version: "6.009.0",
  });
}
