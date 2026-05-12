from aiogram import Router, types
from aiogram.filters import Command
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from bot.database import create_user

router = Router()

def get_main_kb():
    builder = ReplyKeyboardBuilder()
    builder.button(text="🪞 Разбор внешности")
    builder.button(text="👗 Мой гардероб")
    builder.button(text="💎 Подписка")
    builder.adjust(1)
    return builder.as_markup(resize_keyboard=True)

@router.message(Command("start"))
async def cmd_start(message: types.Message):
    await create_user(message.from_user.id)
    await message.answer(
        "Привет! Я твой персональный AI-стилист. 👗✨\n\n"
        "Я помогу тебе определить твой цветотип, форму лица и подберу идеальный гардероб.\n\n"
        "Выбери действие ниже:",
        reply_markup=get_main_kb()
    )
