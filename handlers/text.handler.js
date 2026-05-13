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
