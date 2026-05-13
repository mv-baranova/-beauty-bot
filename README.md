# Mari Beauty Bot ✨

Telegram AI бьюти-стилист на базе Node.js, grammY и Google Gemini.

Мари — твоя стильная подруга, которая поможет тебе найти свой вайб, разберет ошибки стиля и заглянет в звезды.

## Возможности

- ✨ **Анализ фото**: Силуэт, цветотип и конкретные рекомендации.
- 👗 **Собрать образ**: Идеи для твоего настроения.
- 🎨 **Цвета**: Твоя палитра и почему она работает.
- 💄 **Макияж**: Советы по бьюти-образу.
- 🔮 **Астрология**: Развлекательный разбор стиля по дате рождения.
- 🧬 **Матрица судьбы**: Нумерологический вайб-разбор.
- 🛍️ **Подбор с WB**: Помощь в поиске вещей на Wildberries.
- 💎 **Платный образ**: Расширенный подбор за Telegram Stars.

## Как настроить

### 1. Получение Telegram токена
1. Найдите [@BotFather](https://t.me/botfather) в Telegram.
2. Отправьте команду `/newbot` и следуйте инструкциям.

### 2. Получение Gemini API Key
1. Перейдите в [Google AI Studio](https://aistudio.google.com/).
2. Получите API key.

## Локальный запуск

1. Клонируйте репозиторий.
2. Создайте `.env` (см. `.env.example`).
3. `npm install`
4. `npm start`

## TODO
- [ ] future: image generation / virtual try-on via Gemini image model or other image API.
- [ ] future: integrate Wildberries API or affiliate/product feed if available.

## Troubleshooting

- **Логи**: Подробные ошибки пишутся в консоль (Railway/Render).
- **Quota**: Если бот пишет, что "перегрелся", значит превышены лимиты Gemini API.
