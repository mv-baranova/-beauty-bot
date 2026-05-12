# Kira Beauty Bot

Telegram AI бьюти-стилист на базе Node.js, grammY и Google Gemini 1.5 Flash.

## Как настроить

### 1. Получение Telegram токена
1. Найдите [@BotFather](https://t.me/botfather) в Telegram.
2. Отправьте команду `/newbot` и следуйте инструкциям.
3. Сохраните полученный API Token.

### 2. Получение Gemini API Key
1. Перейдите в [Google AI Studio](https://aistudio.google.com/).
2. Нажмите "Get API key".
3. Создайте новый API key.

## Локальный запуск

1. Клонируйте репозиторий.
2. Создайте файл `.env` в корневой папке и добавьте ваши ключи:
   ```env
   BOT_TOKEN=ваш_токен_телеграм
   GEMINI_API_KEY=ваш_ключ_gemini
   ```
3. Установите зависимости:
   ```bash
   npm install
   ```
4. Запустите бота:
   ```bash
   npm start
   ```

## Деплой на Render

1. Создайте новый "Web Service" на [Render](https://render.com/).
2. Подключите ваш GitHub репозиторий.
3. Выберите среду выполнения **Node**.
4. В разделе **Environment Variables** добавьте:
   - `BOT_TOKEN`
   - `GEMINI_API_KEY`
5. Нажмите "Deploy".

## Переменные окружения
- `BOT_TOKEN` — токен вашего бота от BotFather.
- `GEMINI_API_KEY` — ключ API от Google Gemini.
