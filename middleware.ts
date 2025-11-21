export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/api/assessments/:path*", "/api/categories/:path*"],
};
