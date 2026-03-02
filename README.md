# Автосервис — лёгкий сайт на Next.js

Минимальный сайт автосервиса на **Next.js (App Router) + TypeScript + Tailwind**.

## Что внутри

- Тёмная автомобильная тема с янтарными акцентами
- Липкий header с якорями: Прайс / О нас / Записаться
- Слоган: **«Твоя скорость — наша точность»**
- Интерактивные иконки Telegram и Instagram
- Прайс с поиском и фильтрацией
- Калькулятор с мультивыбором услуг и CTA на заявку
- Форма заявки с consent-чекбоксом, красивым file-input (в MVP отправляется имя файла)
- Админка `/admin` с обязательным паролем
- График посещаемости в админке с выбором метрики и периода

## Env

Скопируйте:

```bash
cp .env.example .env.local
```

Заполните:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
ADMIN_PASSWORD=...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Запуск

```bash
npm i
npm run dev
```

- Главная: `http://localhost:3000`
- Вход в админку: `http://localhost:3000/admin-login`
- Админка: `http://localhost:3000/admin`

## Telegram (BotFather)

1. Найдите `@BotFather` → `/newbot`.
2. Получите токен (`TELEGRAM_BOT_TOKEN`).
3. Напишите боту сообщение.
4. Откройте:

```text
https://api.telegram.org/bot<TOKEN>/getUpdates
```

5. Возьмите `chat.id` (`TELEGRAM_CHAT_ID`).

## Документы

- Детальная «память» состояния проекта: `docs/PROJECT_MEMORY.md`
- Деплой на ВМ + домен + HTTPS: `docs/DEPLOY_VM_HTTPS.md`
