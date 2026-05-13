const { generateTextResponse } = require('../services/gemini.service');
const { BUTTONS } = require('./menu.handler');
const { MODES_PROMPTS } = require('../prompts/stylist');

const textHandler = async (ctx) => {
  // Пропускаем команды, они обрабатываются отдельно
  if (ctx.message.text.startsWith('/')) return;

  const text = ctx.message.text;

  // Специальная обработка кнопки "анализ фото"
  if (text === BUTTONS.PHOTO_ANALYSIS) {
    return await ctx.reply('жду твоё фото 📸\nлучше при дневном свете, без фильтров и сильного сжатия');
  }

  const buttonValues = Object.values(BUTTONS);
  let statusMsg;

  try {
    statusMsg = await ctx.reply('собираю pinterest board ✨');

    let prompt = text;
    // Если это кнопка, добавляем специфичный промпт
    if (text === BUTTONS.BUILD_LOOK) prompt = MODES_PROMPTS.OUTFIT;
    else if (text === BUTTONS.COLORS) prompt = MODES_PROMPTS.COLORS;
    else if (text === BUTTONS.MAKEUP) prompt = MODES_PROMPTS.MAKEUP;
    else if (text === BUTTONS.WHAT_SUITS) prompt = MODES_PROMPTS.WHAT_SUITS;
    else if (text === BUTTONS.NOT_TO_WEAR) prompt = MODES_PROMPTS.NOT_TO_WEAR;
    else if (text === BUTTONS.PINTEREST_VIBE) prompt = MODES_PROMPTS.PINTEREST_VIBE;
    else if (text === BUTTONS.HONEST_REVIEW) prompt = MODES_PROMPTS.HONEST_REVIEW;
    else if (text === BUTTONS.CAPSULE) prompt = MODES_PROMPTS.CAPSULE;

    const response = await generateTextResponse(prompt);

    // Удаляем сообщение о загрузке и отправляем ответ
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    await ctx.reply(response);
  } catch (error) {
    console.error('Text Handler Error:', error);
    const errorText = 'что-то я задумалась 😭\nпопробуй еще раз, пожалуйста';

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
