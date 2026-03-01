# Автосервис — лёгкий сайт на Next.js

Минимальный одностраничный сайт автосервиса на **Next.js (App Router) + TypeScript + Tailwind**.

## Что внутри

- Липкий header с якорями на прайс и форму записи
- Intro-блок с условиями
- Прайс с поиском и фильтрацией по категориям
- Форма записи с отправкой в Telegram через серверный API route
- Простая антиспам-защита (honeypot `company`)

## Настройка Telegram

### 1) Создать бота через BotFather

1. Откройте Telegram и найдите `@BotFather`.
2. Отправьте команду `/newbot`.
3. Укажите имя и username бота.
4. BotFather вернёт токен вида `123456:ABC-DEF...` — это `TELEGRAM_BOT_TOKEN`.

### 2) Узнать `chat_id`

Есть несколько способов, простой вариант:

1. Напишите любое сообщение вашему боту в Telegram.
2. Откройте в браузере:

   ```
   https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
   ```

3. В ответе найдите поле `chat.id` — это и есть `TELEGRAM_CHAT_ID`.

> Если `getUpdates` пустой, убедитесь, что вы отправили сообщение боту и повторите запрос.

## Переменные окружения

Скопируйте пример и заполните значения:

```bash
cp .env.example .env.local
```

`.env.local`:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

## Запуск проекта

```bash
npm i
npm run dev
```

Откройте: [http://localhost:3000](http://localhost:3000)

## API

- `POST /api/telegram` — принимает JSON из формы и отправляет сообщение через Telegram Bot API `sendMessage`.
- Токен и `chat_id` используются только на сервере.
