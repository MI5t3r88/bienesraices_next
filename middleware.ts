import { auth } from "@/lib/auth";

export default auth((req) => {
  const estaLogueado = !!req.auth;
  const { pathname } = req.nextUrl;
  const esLogin = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !esLogin && !estaLogueado) {
    return Response.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (esLogin && estaLogueado) {
    return Response.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
