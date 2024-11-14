import { NextResponse } from 'next/server';
import { clerkMiddleware, ClerkMiddlewareAuth, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

// 保護されたルートを定義
const isProtectedRoute = createRouteMatcher(['/speak', '/select-language', '/word-lists', '/map']);

// NEXT_REDIRECT エラーの型定義
type NextRedirectError = {
  digest: string;
  clerk_digest: string;
  returnBackUrl: string;
};

// NEXT_REDIRECT エラーを識別する型ガード
function isNextRedirectError(error: unknown): error is NextRedirectError {
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    return (
      typeof err.digest === 'string' && typeof err.clerk_digest === 'string' && typeof err.returnBackUrl === 'string'
    );
  }
  return false;
}

export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
  try {
    const authObject = await auth();
    const userId = authObject.userId;
    const nextUrl = req.nextUrl;

    console.log('User ID:', userId);

    // 保護されたルートの場合、認証を強制
    if (isProtectedRoute(req)) await auth.protect();

    // バイパスするパスを定義
    const bypassPaths = ['/sign-in', '/sign-up'];

    if (bypassPaths.some((path) => nextUrl.pathname.startsWith(path))) {
      return NextResponse.next();
    }

    if (userId && req.nextUrl.pathname === '/') {
      // ログイン後に'/speak'へリダイレクト
      return NextResponse.redirect(new URL('/speak', req.url));
    }

    // ミドルウェアではリダイレクトのみを行い、他の処理はスキップ
    return NextResponse.next();
  } catch (error: unknown) {
    console.error('Middleware error:', error);

    if (isNextRedirectError(error)) {
      // NEXT_REDIRECT エラーの場合は再スローして Next.js にリダイレクトさせる
      throw error;
    }

    // その他のエラーはエラーページにリダイレクト
    const errorPage = new URL('/error-page', req.url);
    return NextResponse.redirect(errorPage);
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
