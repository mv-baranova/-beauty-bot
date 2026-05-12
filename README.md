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

## Деплой

### На Render
1. Создайте новый "Web Service" на [Render](https://render.com/).
2. Подключите ваш GitHub репозиторий.
3. Выберите среду выполнения **Node**.
4. В разделе **Environment Variables** добавьте:
   - `BOT_TOKEN`
   - `GEMINI_API_KEY`

### На Railway
1. Создайте новый проект на [Railway](https://railway.app/).
2. Подключите GitHub репозиторий.
3. Добавьте переменные окружения в разделе **Variables**.

## Troubleshooting (Решение проблем)

### Проверка логов
- **Railway:** Перейдите во вкладку **Logs** в вашем сервисе.
- **Render:** Перейдите во вкладку **Events** или **Logs** в панели управления сервисом.

### Частые ошибки
- **BOT_TOKEN is missing:** Вы не добавили `BOT_TOKEN` в переменные окружения.
- **GEMINI_API_KEY is missing:** Вы не добавили `GEMINI_API_KEY` в переменные окружения.
- **Error: 401 Unauthorized (Telegram):** Неправильный `BOT_TOKEN`. Перевыпустите его в BotFather.
- **Error: 403 Forbidden (Gemini):** Неправильный `GEMINI_API_KEY` или у вашего аккаунта нет доступа к API.
- **Error: 429 Too Many Requests (Gemini):** Вы превысили квоту бесплатных запросов. Подождите немного или используйте другой API-ключ.
- **Safety Error (Gemini):** Gemini заблокировал запрос из-за политики безопасности (например, если фото показалось системе недопустимым).

## Переменные окружения
- `BOT_TOKEN` — токен вашего бота от BotFather.
- `GEMINI_API_KEY` — ключ API от Google Gemini.
