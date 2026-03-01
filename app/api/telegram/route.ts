import { NextResponse } from 'next/server';
import { appendLead } from '@/lib/leads';

export const runtime = 'nodejs';

type RequestBody = {
  fullName?: string;
  contact?: string;
  car?: string;
  comment?: string;
  company?: string;
};

type TelegramSendResponse = {
  ok: boolean;
  description?: string;
  result?: {
    message_id?: number;
  };
};

function normalize(value: string | undefined): string {
  return (value || '').trim();
}

function safeValue(value: string): string {
  return value.length > 0 ? value : '—';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (normalize(body.company).length > 0) {
      return NextResponse.json({ ok: true });
    }

    const fullName = normalize(body.fullName);
    const contact = normalize(body.contact);
    const car = normalize(body.car);
    const comment = normalize(body.comment);

    if (!fullName) {
      return NextResponse.json({ ok: false, error: 'Укажите ФИО.' }, { status: 400 });
    }

    if (!contact) {
      return NextResponse.json(
        { ok: false, error: 'Укажите телефон или Telegram.' },
        { status: 400 }
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json(
        { ok: false, error: 'Сервер не настроен для отправки в Telegram.' },
        { status: 500 }
      );
    }

    const message = [
      'Новая заявка:',
      `ФИО: ${safeValue(fullName)}`,
      `Контакт: ${safeValue(contact)}`,
      `Авто: ${safeValue(car)}`,
      `Комментарий: ${safeValue(comment)}`,
      'Статус: не обработано'
    ].join('\n');

    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        reply_markup: {
          inline_keyboard: [[{ text: 'Не обработано', callback_data: 'lead_mark_done' }]]
        }
      }),
      cache: 'no-store'
    });

    const telegramPayload = (await telegramResponse.json()) as TelegramSendResponse;

    if (!telegramResponse.ok || !telegramPayload.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: telegramPayload.description || 'Не удалось отправить сообщение в Telegram.'
        },
        { status: 502 }
      );
    }

    await appendLead({
      fullName,
      contact,
      car,
      comment,
      status: 'не обработано',
      telegramMessageId: telegramPayload.result?.message_id
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/telegram failed', error);
    return NextResponse.json({ ok: false, error: 'Некорректный формат запроса.' }, { status: 400 });
  }
}
