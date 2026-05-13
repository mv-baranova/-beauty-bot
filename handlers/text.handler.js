const { generateTextResponse, generateWithPrompt } = require('../services/gemini.service');
const { IMAGE_GEN_PROMPT } = require('../prompts/stylist');
const { generateImage } = require('../services/image.service');
const { BUTTONS, profileHandler, styleHandler, memoryHandler } = require('./menu.handler');
const { handleAstrologyInput, handleMatrixInput } = require('./entertainment.handler');

const textHandler = async (ctx) => {
  // Пропускаем команды, они обрабатываются отдельно
  if (ctx.message.text.startsWith('/')) return;

  const text = ctx.message.text;

  // Handle multi-step inputs
  if (ctx.session.step.startsWith('astro_')) {
    return await handleAstrologyInput(ctx);
  }
  if (ctx.session.step.startsWith('matrix_')) {
    return await handleMatrixInput(ctx);
  }

  // Специальная обработка кнопок меню
  if (text === BUTTONS.PHOTO_ANALYSIS) {
    return await ctx.reply('жду твоё фото, красавица 📸\nлучше при дневном свете и в полный рост');
  }
  if (text === BUTTONS.MY_PROFILE) {
    return await profileHandler(ctx);
  }
  if (text === BUTTONS.MY_STYLE) {
    return await styleHandler(ctx);
  }
  if (text === BUTTONS.MEMORY_CHECK) {
    return await memoryHandler(ctx);
  }

  // Если это кнопка "собрать образ"
  if (text === BUTTONS.BUILD_LOOK) {
    const statusMsg = await ctx.reply('собираю pinterest board ✨');
    const response = await generateTextResponse('собери мне полный образ на сегодня', ctx);
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    const keyboards = require('../utils/keyboards');
    return await ctx.reply(response, { reply_markup: keyboards.postVibe });
  }

  // Если это кнопка "цвета"
  if (text === BUTTONS.COLORS) {
    const statusMsg = await ctx.reply('подбираю палитру 🎨');
    const response = await generateTextResponse('какие цвета мне идут? расскажи про актуальные сочетания', ctx);
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    return await ctx.reply(response);
  }

  // Если это кнопка "макияж"
  if (text === BUTTONS.MAKEUP) {
    const statusMsg = await ctx.reply('рисую стрелки... 💄');
    const response = await generateTextResponse('какой макияж сейчас в тренде? посоветуй под мой vibe', ctx);
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    return await ctx.reply(response);
  }

  const buttonValues = Object.values(BUTTONS);
  let statusMsg;

  try {
    // Special handling for "visualize" requests
    if (text.toLowerCase().includes('визуализируй') || text.toLowerCase().includes('покажи') || text.toLowerCase().includes('visualize')) {
      statusMsg = await ctx.reply('создаю твой visual board... ✨');
      const visualPrompt = await generateWithPrompt(IMAGE_GEN_PROMPT, text, ctx);
      const imageUrl = await generateImage(visualPrompt);
      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
      return await ctx.replyWithPhoto(imageUrl, { caption: 'вот как я это вижу ☁️' });
    }

    statusMsg = await ctx.reply('собираю pinterest board ✨');

    let prompt = text;
    // Если это кнопка, добавляем контекст
    if (buttonValues.includes(text)) {
      prompt = `расскажи про: ${text}`;
    }

    const response = await generateTextResponse(prompt, ctx);

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
