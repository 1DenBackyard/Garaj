# Хороший сервис - сайт автосервиса

Легкий одностраничный сайт на **Next.js (App Router) + TypeScript + Tailwind**.

## Что уже реализовано

- Адаптивная мобильная вёрстка: удобно смотреть прайс и заполнять форму с телефона.
- Один экран с разделами: интро, прайс, блок про запчасти, обратная связь.
- Поиск по услугам и фильтр по категориям.
- Отправка заявки в Telegram через серверный `POST /api/telegram`.
- Антиспам: скрытое поле `company` (honeypot) и минимальная валидация.
- В Telegram заявка публикуется отдельным постом с кнопкой `Не обработано`.
- По клику статус меняется на `Обработано ✅` через webhook (`/api/telegram/webhook`).
- Заявки сохраняются в `storage/leads.json` и доступны для выгрузки CSV.

## Локальное виртуальное окружение (для теста)

Рекомендуется запускать проект в изолированном Node-окружении через `nvm`.

1. Установите Node.js 20 через nvm:

```bash
nvm install 20
nvm use 20
node -v
```

2. Установите зависимости и запустите:

```bash
npm i
npm run dev
```

Сайт откроется на `http://localhost:3000`.

## Переменные окружения

Скопируйте пример:

```bash
cp .env.example .env.local
```

Заполните `.env.local`:

```env
TELEGRAM_BOT_TOKEN=123456:ABCDEF...
TELEGRAM_CHAT_ID=-1001234567890
TELEGRAM_WEBHOOK_SECRET=any_random_secret_string
LEADS_EXPORT_TOKEN=strong_export_token
```

- `TELEGRAM_BOT_TOKEN` - токен бота из BotFather.
- `TELEGRAM_CHAT_ID` - ID закрытого канала/чата, куда постим лиды.
- `TELEGRAM_WEBHOOK_SECRET` - опционально, защита webhook.
- `LEADS_EXPORT_TOKEN` - опционально, защита выгрузки CSV.

## Как создать бота (BotFather)

1. Откройте Telegram и найдите `@BotFather`.
2. Отправьте `/newbot`.
3. Укажите имя и username бота.
4. Сохраните токен, который вернет BotFather.

## Как настроить закрытый канал для лидов

1. Создайте закрытый канал в Telegram.
2. Добавьте вашего бота в канал.
3. Выдайте боту права администратора (минимум: публикация сообщений).
4. В `.env.local` укажите `TELEGRAM_CHAT_ID` этого канала.

## Как узнать `chat_id` канала

1. Временно отключите webhook (если уже включен):

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/deleteWebhook
```

2. Опубликуйте любое сообщение в вашем канале.
3. Откройте:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates
```

4. Найдите `channel_post.chat.id` (обычно вида `-100...`) - это и есть `TELEGRAM_CHAT_ID`.

## Включение webhook для кнопки "Обработано"

После деплоя (нужен публичный HTTPS URL):

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<YOUR_DOMAIN>/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>
```

Проверка:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo
```

Без webhook кнопка в Telegram будет отображаться, но не сможет менять статус.

## Выгрузка заявок таблицей

CSV выгрузка доступна по GET:

```text
http://localhost:3000/api/leads/export?token=<LEADS_EXPORT_TOKEN>
```

Если `LEADS_EXPORT_TOKEN` не задан, выгрузка будет доступна без токена.

## Полезные маршруты

- `POST /api/telegram` - отправка заявки из формы в Telegram.
- `POST /api/telegram/webhook` - обработка нажатия кнопки статуса.
- `GET /api/leads/export` - скачать заявки в CSV.
