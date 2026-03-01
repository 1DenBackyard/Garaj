import { NextResponse } from 'next/server';
import { markLeadProcessed } from '@/lib/leads';

export const runtime = 'nodejs';

type CallbackQuery = {
  id?: string;
  data?: string;
  message?: {
    text?: string;
    message_id?: number;
    chat?: {
      id?: number | string;
    };
  };
};

type TelegramUpdate = {
  callback_query?: CallbackQuery;
};

const MARK_DONE = 'lead_mark_done';
const ALREADY_DONE = 'lead_done';

async function telegramCall(token: string, method: string, payload: Record<string, unknown>) {
  await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
    cache: 'no-store'
  });
}

function getUpdatedText(text: string): string {
  if (text.includes('Статус: обработано')) {
    return text;
  }

  if (text.includes('Статус: не обработано')) {
    return text.replace('Статус: не обработано', 'Статус: обработано');
  }

  return `${text}\nСтатус: обработано`;
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ ok: true });
  }

  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (webhookSecret) {
    const secretHeader = request.headers.get('x-telegram-bot-api-secret-token');
    if (secretHeader !== webhookSecret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  try {
    const update = (await request.json()) as TelegramUpdate;
    const callback = update.callback_query;

    if (!callback) {
      return NextResponse.json({ ok: true });
    }

    const callbackId = callback.id;
    const callbackData = callback.data;
    const message = callback.message;
    const messageId = message?.message_id;
    const chatId = message?.chat?.id;

    if (!callbackId || !callbackData || !messageId || !chatId) {
      return NextResponse.json({ ok: true });
    }

    if (callbackData === ALREADY_DONE) {
      await telegramCall(token, 'answerCallbackQuery', {
        callback_query_id: callbackId,
        text: 'Уже отмечено как обработано'
      });
      return NextResponse.json({ ok: true });
    }

    if (callbackData !== MARK_DONE) {
      await telegramCall(token, 'answerCallbackQuery', {
        callback_query_id: callbackId
      });
      return NextResponse.json({ ok: true });
    }

    const updatedText = getUpdatedText(message.text || 'Новая заявка:\nСтатус: обработано');

    await Promise.all([
      telegramCall(token, 'answerCallbackQuery', {
        callback_query_id: callbackId,
        text: 'Отмечено как обработано'
      }),
      telegramCall(token, 'editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text: updatedText,
        reply_markup: {
          inline_keyboard: [[{ text: 'Обработано ✅', callback_data: ALREADY_DONE }]]
        }
      }),
      markLeadProcessed(messageId).catch((error) => {
        console.error('markLeadProcessed failed', error);
      })
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/telegram/webhook failed', error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
