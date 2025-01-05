import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();


export const config = {
  matcher: [
    // Логируем все запросы, чтобы понять, что попадает в мидлвар
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/api/uploadthing",
  ],
};
