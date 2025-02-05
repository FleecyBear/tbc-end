import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=missing_code`);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(), 
        setAll: async (newCookies) => {
          const cookieStore = await cookies();
          newCookies.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Error exchanging code for session:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=exchange_failed`);
  }

  if (data.session) {
    const response = NextResponse.redirect(`${requestUrl.origin}/home`);

    const { access_token, refresh_token } = data.session;
    response.cookies.set('access_token', access_token, { httpOnly: true, path: '/' });
    response.cookies.set('refresh_token', refresh_token, { httpOnly: true, path: '/' });

    return response;
  }

  return NextResponse.redirect(`${requestUrl.origin}/login?error=unknown_error`);
}