# Деплой на ВМ + домен + HTTPS (пошагово)

## 1) Подготовка ВМ
Пример: Ubuntu 22.04.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2
```

## 2) Клонирование и установка
```bash
cd /var/www
sudo git clone <YOUR_REPO_URL> garaj
cd garaj
sudo npm i
sudo npm run build
```

## 3) Переменные окружения
Создайте `.env.local`:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
ADMIN_PASSWORD=СЛОЖНЫЙ_ПАРОЛЬ
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

Права:
```bash
sudo chown -R $USER:$USER /var/www/garaj
chmod 600 .env.local
```

## 4) Запуск через PM2
```bash
pm2 start npm --name garaj -- start
pm2 save
pm2 startup
```

Приложение слушает `localhost:3000`.

## 5) Настройка домена (DNS)
У регистратора домена:
- A-запись `@` -> IP ВМ
- (опционально) A-запись `www` -> IP ВМ

Дождитесь распространения DNS.

## 6) Reverse proxy Nginx
`/etc/nginx/sites-available/garaj`:

```nginx
server {
  listen 80;
  server_name your-domain.com www.your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/garaj /etc/nginx/sites-enabled/garaj
sudo nginx -t
sudo systemctl reload nginx
```

## 7) HTTPS (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Проверка автопродления:
```bash
sudo certbot renew --dry-run
```

## 8) Обновления релиза
```bash
cd /var/www/garaj
git pull
npm i
npm run build
pm2 restart garaj
```

## 9) Минимальный чек-лист после деплоя
- Открывается `https://your-domain.com`
- Форма отправляет в Telegram
- `/admin-login` принимает `ADMIN_PASSWORD`
- `/admin` недоступен без авторизации
- Nginx и PM2 автозапускаются после reboot
