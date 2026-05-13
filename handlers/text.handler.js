const { generateTextResponse } = require('../services/gemini.service');
const { BUTTONS } = require('./menu.handler');

const textHandler = async (ctx) => {
  // Пропускаем команды, они обрабатываются отдельно
  if (ctx.message.text.startsWith('/')) return;

  const text = ctx.message.text;

  // Специальная обработка кнопки "анализ фото"
  if (text === BUTTONS.PHOTO_ANALYSIS) {
    return await ctx.reply('жду твоё фото, красавица 📸\nлучше при дневном свете и в полный рост');
  }

  // Если это кнопка "собрать образ"
  if (text === BUTTONS.BUILD_LOOK) {
    const { generateTextResponse } = require('../services/gemini.service');
    const statusMsg = await ctx.reply('собираю pinterest board ✨');
    const response = await generateTextResponse('собери мне полный образ на сегодня');
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    const keyboards = require('../utils/keyboards');
    return await ctx.reply(response, { reply_markup: keyboards.postVibe });
  }

  // Если это кнопка "цвета"
  if (text === BUTTONS.COLORS) {
    const { generateTextResponse } = require('../services/gemini.service');
    const statusMsg = await ctx.reply('подбираю палитру 🎨');
    const response = await generateTextResponse('какие цвета мне идут? расскажи про актуальные сочетания');
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    return await ctx.reply(response);
  }

  // Если это кнопка "макияж"
  if (text === BUTTONS.MAKEUP) {
    const { generateTextResponse } = require('../services/gemini.service');
    const statusMsg = await ctx.reply('рисую стрелки... 💄');
    const response = await generateTextResponse('какой макияж сейчас в тренде? посоветуй под мой vibe');
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    return await ctx.reply(response);
  }

  const buttonValues = Object.values(BUTTONS);
  let statusMsg;

  try {
    statusMsg = await ctx.reply('собираю pinterest board ✨');

    let prompt = text;
    // Если это кнопка, добавляем контекст
    if (buttonValues.includes(text)) {
      prompt = `расскажи про: ${text}`;
    }

    const response = await generateTextResponse(prompt);

    // Удаляем сообщение о загрузке и отправляем ответ
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    await ctx.reply(response);
  } catch (error) {
    console.error('Text Handler Error:', error);
    const errorText = 'прости, я немного задумалась 😭\nпопробуй еще раз, пожалуйста';

    if (statusMsg) {
      try {
        await ctx.api.editMessageText(ctx.chat.id, statusMsg.message_id, errorText);
      } catch (e) {
        await ctx.reply(errorText);
      }
    } else {
      await ctx.reply(errorText);
    }
  }
};

module.exports = {
  textHandler,
};
