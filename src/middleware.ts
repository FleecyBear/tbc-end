import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = ['en', 'ge'];  
const defaultLocale = 'ge';  

export const config = {
  matcher: [
    '/((?!images|static|_next).*)',  
  ],
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale; 

  if (!supportedLocales.some((locale) => pathname.startsWith(`/${locale}`))) {
    return NextResponse.redirect(new URL(`/${localeCookie}${pathname}`, request.url));
  }

  return NextResponse.next();
}
