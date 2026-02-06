import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/sign-in', '/sign-up'];
const DEFAULT_PRIVATE_ROUTE = '/chats';
const DEFAULT_PUBLIC_ROUTE = '/sign-in';

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  if (!accessToken && !isPublicRoute) {
    const url = request.nextUrl.clone();

    url.pathname = DEFAULT_PUBLIC_ROUTE;

    return NextResponse.redirect(url);
  }

  if (accessToken && isPublicRoute) {
    const url = request.nextUrl.clone();

    url.pathname = DEFAULT_PRIVATE_ROUTE;

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
