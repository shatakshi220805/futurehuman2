import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher(["/app(.*)", "/api/trpc(.*)", "/api/chat(.*)", "/api/checkout(.*)", "/api/billing(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtected(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/"],
};
