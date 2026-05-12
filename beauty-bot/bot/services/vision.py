import asyncio
from google import genai
from google.genai import types
import PIL.Image
import io
from bot.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

async def analyze_appearance(image_bytes: bytes):
    image = PIL.Image.open(io.BytesIO(image_bytes))

    prompt = """
Ты — профессиональный стилист. Проанализируй фото человека.

БЕСПЛАТНАЯ ЧАСТЬ:
1. Цветотип (тёплый/холодный, сезон)
2. Форма лица
3. Архетип внешности — красивое название ("тёплая итальянка", "холодная скандинавка")
4. Сильные черты (2-3 комплимента)

---РАЗДЕЛИТЕЛЬ---

ПЛАТНАЯ ЧАСТЬ:
1. Стрижки (3-4 варианта)
2. Палитра цветов одежды (5-7 конкретных цветов)
3. Цвета которых избегать
4. Стили одежды (2-3 направления)
5. Макияж (конкретные оттенки)
6. Аксессуары (металл, форма, размер)
7. Главный совет

Тон: тёплый, дружеский, конкретный.
"""
    try:
        response = await client.aio.models.generate_content(
            model='gemini-2.0-flash',
            contents=[prompt, image]
        )

        text = response.text
        if "---РАЗДЕЛИТЕЛЬ---" in text:
            free_part, full_part = text.split("---РАЗДЕЛИТЕЛЬ---", 1)
            return free_part.strip(), full_part.strip()
        else:
            return text.strip(), ""
    except Exception as e:
        print(f"Error in Gemini: {e}")
        return None, None

async def analyze_wardrobe_item(image_bytes: bytes):
    image = PIL.Image.open(io.BytesIO(image_bytes))
    prompt = "Проанализируй фото одежды. Определи: тип (верх/низ/платье/обувь/аксессуар), цвет, стиль, сезонность, с чем сочетается. Ответь кратко."

    try:
        response = await client.aio.models.generate_content(
            model='gemini-2.0-flash',
            contents=[prompt, image]
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error in Gemini: {e}")
        return None

async def suggest_outfit(items_descriptions: list, occasion: str):
    items_text = "\n".join([f"- {desc}" for desc in items_descriptions])
    prompt = f"""
У меня есть следующие вещи в гардеробе:
{items_text}

Собери из них стильный образ для следующего повода: {occasion}.
Дай краткую рекомендацию.
"""
    try:
        response = await client.aio.models.generate_content(
            model='gemini-2.0-flash',
            contents=[prompt]
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error in Gemini: {e}")
        return None
