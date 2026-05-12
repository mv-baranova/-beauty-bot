# Beauty AI Stylist Bot

Telegram-бот "AI-стилист" на Python. Бот анализирует внешность по фото и помогает с гардеробом.

## Стек
- Python 3.11
- aiogram 3.x
- Google Gemini API (gemini-2.0-flash)
- SQLite (aiosqlite)
- python-dotenv

## Установка

1. Клонируйте репозиторий.
2. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
3. Создайте файл `.env` на основе `.env.example` и заполните его:
   - `BOT_TOKEN`: Токен вашего бота от @BotFather
   - `GEMINI_API_KEY`: API ключ от Google AI Studio

## Запуск
```bash
python -m bot.main
```

## Структура
- `bot/main.py`: Точка входа
- `bot/config.py`: Конфигурация
- `bot/database.py`: Работа с БД
- `bot/handlers/`: Обработчики команд и сообщений
- `bot/services/vision.py`: Интеграция с Gemini API
