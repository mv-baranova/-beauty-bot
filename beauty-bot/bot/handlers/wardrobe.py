from aiogram import Router, F, types, Bot
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton
from bot.services.vision import analyze_wardrobe_item, suggest_outfit
from bot.database import add_wardrobe_item, get_wardrobe, get_user
import io

router = Router()

class WardrobeStates(StatesGroup):
    waiting_for_item_photo = State()
    waiting_for_occasion = State()

@router.message(F.text == "👗 Мой гардероб")
async def wardrobe_menu(message: Message):
    kb = [
        [KeyboardButton(text="➕ Добавить вещь")],
        [KeyboardButton(text="✨ Собрать образ")],
        [KeyboardButton(text="🔙 Назад")]
    ]
    markup = ReplyKeyboardMarkup(keyboard=kb, resize_keyboard=True)
    await message.answer("Здесь ты можешь управлять своим гардеробом.", reply_markup=markup)

@router.message(F.text == "➕ Добавить вещь")
async def add_item_start(message: Message, state: FSMContext):
    await message.answer("Пришли фото вещи, которую хочешь добавить в гардероб.")
    await state.set_state(WardrobeStates.waiting_for_item_photo)

@router.message(WardrobeStates.waiting_for_item_photo, F.photo)
async def process_item_photo(message: Message, state: FSMContext, bot: Bot):
    await message.answer("Анализирую вещь... 🔍")

    photo = message.photo[-1]
    file = await bot.get_file(photo.file_id)
    photo_bytes = io.BytesIO()
    await bot.download_file(file.file_path, photo_bytes)

    analysis = await analyze_wardrobe_item(photo_bytes.getvalue())

    if analysis:
        # We'll store the raw analysis for simplicity, or we could parse it
        await add_wardrobe_item(
            user_id=message.from_user.id,
            item_type="auto",
            color="auto",
            style="auto",
            season="auto",
            description=analysis
        )
        await message.answer(f"Вещь добавлена!\n\n<b>Описание:</b>\n{analysis}", parse_mode="HTML")
    else:
        await message.answer("Не удалось проанализировать вещь. Попробуй позже.")

    await state.clear()

@router.message(F.text == "✨ Собрать образ")
async def suggest_outfit_start(message: Message, state: FSMContext):
    user = await get_user(message.from_user.id)
    if not user or not user['is_subscribed']:
        await message.answer("Функция сбора образов доступна только по подписке. 💎")
        return

    items = await get_wardrobe(message.from_user.id)
    if not items:
        await message.answer("Твой гардероб пуст. Сначала добавь вещи!")
        return

    await message.answer("Куда ты собираешься? (например: работа, свидание, прогулка)")
    await state.set_state(WardrobeStates.waiting_for_occasion)

@router.message(WardrobeStates.waiting_for_occasion)
async def process_occasion(message: Message, state: FSMContext):
    occasion = message.text
    items = await get_wardrobe(message.from_user.id)
    items_descriptions = [item['description'] for item in items]

    await message.answer("Подбираю образ из твоих вещей... 👗👠")
    outfit = await suggest_outfit(items_descriptions, occasion)

    if outfit:
        await message.answer(f"<b>Твой образ для повода '{occasion}':</b>\n\n{outfit}", parse_mode="HTML")
    else:
        await message.answer("Не удалось составить образ. Попробуй позже.")

    await state.clear()

@router.message(F.text == "🔙 Назад")
async def back_to_main(message: Message):
    from bot.handlers.start import get_main_kb
    await message.answer("Главное меню", reply_markup=get_main_kb())
