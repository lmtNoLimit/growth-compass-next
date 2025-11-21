import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Optional: Add callbacks or pages configuration here if needed in the future
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/assessments/:path*", "/api/categories/:path*"],
};
