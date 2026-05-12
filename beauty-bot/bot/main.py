import asyncio
import logging
from aiogram import Bot, Dispatcher
from bot.config import BOT_TOKEN
from bot.database import init_db
from bot.handlers import start, analysis, wardrobe, payment

logging.basicConfig(level=logging.INFO)

async def main():
    # Initialize database
    await init_db()

    # Initialize bot and dispatcher
    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()

    # Register routers
    dp.include_router(start.router)
    dp.include_router(analysis.router)
    dp.include_router(wardrobe.router)
    dp.include_router(payment.router)

    # Start polling
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Bot stopped")
