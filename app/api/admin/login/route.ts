import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createAdminToken, getAdminCookieName, isValidAdminPassword } from '@/lib/admin-auth';

type Body = { password?: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const password = (body.password || '').trim();

    if (!isValidAdminPassword(password)) {
      return NextResponse.json({ ok: false, error: 'Неверный пароль.' }, { status: 401 });
    }

    cookies().set({
      name: getAdminCookieName(),
      value: createAdminToken(password),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Некорректный запрос.' }, { status: 400 });
  }
}
