// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isProtectedRoute = createRouteMatcher(['/speak', '/word-lists', '/map']);

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) await auth.protect();
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };

// middleware.ts
// middleware.ts
import { NextResponse } from 'next/server';
import { clerkMiddleware, ClerkMiddlewareAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
  try {
    const authObject = await auth();
    const userId = authObject.userId;
    const nextUrl = req.nextUrl;

    // console.log('Auth Object:', authObject);
    console.log('User ID:', userId);
    // console.log('Requested Path:', nextUrl.pathname);

    // if (!userId) {
    //   // ユーザーが未認証の場合は /sign-in にリダイレクト
    //   const signInUrl = new URL('/sign-in', req.url);
    //   return NextResponse.redirect(signInUrl);
    // }

    // バイパスするパスを定義
    const bypassPaths = ['/select-language', '/speak', '/api', '/sign-in', '/sign-up'];

    if (bypassPaths.some((path) => nextUrl.pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Middleware ではデータベース操作を行わないため、ここではリダイレクトのみ行います
    // 言語設定の確認はページやAPIルートで行います

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
