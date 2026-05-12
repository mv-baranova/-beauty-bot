from aiogram import Router, F, types, Bot
from aiogram.types import Message, LabeledPrice

router = Router()

@router.message(F.text == "💎 Подписка")
async def subscription_menu(message: Message, bot: Bot):
    prices = [LabeledPrice(label="Подписка на месяц", amount=200)]
    await bot.send_invoice(
        chat_id=message.chat.id,
        title="Подписка AI-стилист",
        description="Безлимитные полные разборы и функция сбора образов на 30 дней.",
        payload="subscription",
        provider_token="", # Telegram Stars
        currency="XTR",
        prices=prices
    )
