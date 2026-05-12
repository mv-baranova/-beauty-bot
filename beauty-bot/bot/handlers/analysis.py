from aiogram import Router, F, types, Bot
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, LabeledPrice, PreCheckoutQuery
from bot.services.vision import analyze_appearance
from bot.database import save_analysis, get_user, set_subscribed
import io

router = Router()

class AnalysisStates(StatesGroup):
    waiting_for_photo = State()

@router.message(F.text == "🪞 Разбор внешности")
async def start_analysis(message: Message, state: FSMContext):
    await message.answer("Пришли своё селфи для анализа (желательно при дневном свете и без фильтров).")
    await state.set_state(AnalysisStates.waiting_for_photo)

@router.message(AnalysisStates.waiting_for_photo, F.photo)
async def process_photo(message: Message, state: FSMContext, bot: Bot):
    await message.answer("Анализирую... Это может занять до минуты. ⏳")

    photo = message.photo[-1]
    file = await bot.get_file(photo.file_id)
    file_path = file.file_path

    # Download file to bytes
    photo_bytes = io.BytesIO()
    await bot.download_file(file_path, photo_bytes)

    free_text, full_text = await analyze_appearance(photo_bytes.getvalue())

    if free_text is None:
        await message.answer("Произошла ошибка при анализе. Попробуй через минуту.")
        await state.clear()
        return

    await save_analysis(message.from_user.id, free_text, full_text)

    await message.answer(f"<b>Твой бесплатный разбор:</b>\n\n{free_text}", parse_mode="HTML")

    # Check if user already has subscription
    user = await get_user(message.from_user.id)
    if user and user['is_subscribed']:
        await message.answer(f"<b>Твой полный разбор (по подписке):</b>\n\n{full_text}", parse_mode="HTML")
    else:
        # Offer full analysis for Stars
        prices = [LabeledPrice(label="Полный разбор", amount=50)]
        await bot.send_invoice(
            chat_id=message.chat.id,
            title="Полный разбор внешности",
            description="Получи рекомендации по стрижкам, палитре цветов, стилям одежды и макияжу.",
            payload="full_analysis",
            provider_token="", # Empty for Telegram Stars
            currency="XTR",
            prices=prices
        )

    await state.clear()

@router.message(AnalysisStates.waiting_for_photo)
async def not_a_photo(message: Message):
    await message.answer("Пожалуйста, отправь фото.")

@router.pre_checkout_query()
async def process_pre_checkout(pre_checkout_query: PreCheckoutQuery):
    await pre_checkout_query.answer(ok=True)

@router.message(F.successful_payment)
async def process_successful_payment(message: Message, bot: Bot):
    payload = message.successful_payment.invoice_payload
    if payload == "full_analysis":
        from bot.database import get_last_analysis
        analysis = await get_last_analysis(message.from_user.id)
        if analysis:
            await message.answer(f"🎉 Спасибо за оплату!\n\n<b>Твой полный разбор:</b>\n\n{analysis['full_text']}", parse_mode="HTML")
        else:
            await message.answer("Спасибо за оплату! Пожалуйста, сделай разбор заново, чтобы увидеть результат.")
    elif payload == "subscription":
        await set_subscribed(message.from_user.id, 1)
        await message.answer("🎉 Ура! Подписка активирована на месяц. Теперь тебе доступны все полные разборы и сбор луков!")
