const { generateTextResponse } = require('../services/gemini.service');
const { BUTTONS, startHandler } = require('./menu.handler');
const { ASTROLOGY_PROMPT, MATRIX_PROMPT, WB_SEARCH_PROMPT, PREMIUM_LOOK_PROMPT, MODES_PROMPTS } = require('../prompts/stylist');
const { getSession, resetSession } = require('../utils/session');

const textHandler = async (ctx) => {
  if (!ctx.message || !ctx.message.text) return;

  const userId = ctx.from.id;
  const session = getSession(userId);
  const text = ctx.message.text;

  // 1. Команды
  if (text.startsWith('/')) return;

  // 2. Перезапуск
  if (text === BUTTONS.RESTART) {
    resetSession(userId);
    return await startHandler(ctx);
  }

  // 3. Анализ фото (кнопка)
  if (text === BUTTONS.PHOTO_ANALYSIS) {
    resetSession(userId);
    return await ctx.reply('жду твоё фото 📸\nлучше при дневном свете и без сильного сжатия');
  }

  // 4. Логика Астрологии
  if (text === BUTTONS.ASTROLOGY || session.state.startsWith('astro_')) {
    if (text === BUTTONS.ASTROLOGY) {
      session.state = 'astro_date';
      return await ctx.reply('напиши дату рождения (например, 01.01.1990) 🗓️');
    }
    if (session.state === 'astro_date') {
      session.data.birthDate = text;
      session.state = 'astro_time';
      return await ctx.reply('время рождения? ⏰');
    }
    if (session.state === 'astro_time') {
      session.data.birthTime = text;
      session.state = 'astro_city';
      return await ctx.reply('город рождения? 🏙️');
    }
    if (session.state === 'astro_city') {
      session.data.birthCity = text;
      const userContext = `Дата: ${session.data.birthDate}, Время: ${session.data.birthTime}, Город: ${session.data.birthCity}`;
      session.state = 'idle';

      const statusMsg = await ctx.reply('смотрю в звезды... ✨');
      const response = await generateTextResponse(`${ASTROLOGY_PROMPT}\nДанные: ${userContext}`);
      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
      return await ctx.reply(response);
    }
  }

  // 5. Логика Матрицы
  if (text === BUTTONS.MATRIX || session.state === 'matrix_date') {
    if (text === BUTTONS.MATRIX) {
      session.state = 'matrix_date';
      return await ctx.reply('напиши дату рождения ДД.ММ.ГГГГ 🧬');
    }
    if (session.state === 'matrix_date') {
      session.state = 'idle';
      const statusMsg = await ctx.reply('считаю энергию... 🧬');
      const response = await generateTextResponse(`${MATRIX_PROMPT}\nДата: ${text}`);
      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
      return await ctx.reply(response);
    }
  }

  // 6. Логика WB
  if (text === BUTTONS.WB_SHOPPING || session.state.startsWith('wb_')) {
    if (text === BUTTONS.WB_SHOPPING) {
      session.state = 'wb_item';
      return await ctx.reply('что ищем? 🛍️');
    }
    if (session.state === 'wb_item') {
      session.data.wbItem = text;
      session.state = 'wb_budget';
      return await ctx.reply('бюджет? 💸');
    }
    if (session.state === 'wb_budget') {
      session.data.wbBudget = text;
      session.state = 'wb_style';
      return await ctx.reply('стиль? ✨');
    }
    if (session.state === 'wb_style') {
      session.data.wbStyle = text;
      const userContext = `Предмет: ${session.data.wbItem}, Бюджет: ${session.data.wbBudget}, Стиль: ${session.data.wbStyle}`;
      session.state = 'idle';

      const statusMsg = await ctx.reply('ищу варианты... 🛍️');
      const response = await generateTextResponse(`${WB_SEARCH_PROMPT}\nЗапрос: ${userContext}`);
      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
      return await ctx.reply(response);
    }
  }

  // 7. Платный образ (Invoice)
  if (text === BUTTONS.PREMIUM_LOOK) {
    resetSession(userId);
    return await ctx.replyWithInvoice(
      '💎 Премиум подбор',
      'Расширенный подбор: образ + палитра + макияж + moodboard prompt + WB keywords.',
      'premium_look_payload',
      '',
      'XTR',
      [{ label: 'Premium Look', amount: 100 }]
    );
  }

  // 8. Свободный текст и остальные кнопки
  let statusMsg;
  try {
    statusMsg = await ctx.reply('собираю pinterest board ✨');

    let prompt = text;
    let complex = false;

    if (text === BUTTONS.BUILD_LOOK) prompt = MODES_PROMPTS.OUTFIT;
    else if (text === BUTTONS.COLORS) prompt = MODES_PROMPTS.COLORS;
    else if (text === BUTTONS.MAKEUP) prompt = MODES_PROMPTS.MAKEUP;

    if (session.state !== 'idle') session.state = 'idle';

    const response = await generateTextResponse(prompt, complex);
    if (statusMsg) await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    await ctx.reply(response);
  } catch (error) {
    console.error('Text Handler Error:', error);
    const errorText = 'прости, я немного задумалась 😭\nпопробуй еще раз';
    if (statusMsg) {
      try { await ctx.api.editMessageText(ctx.chat.id, statusMsg.message_id, errorText); }
      catch (e) { await ctx.reply(errorText); }
    } else {
      await ctx.reply(errorText);
    }
  }
};

module.exports = {
  textHandler,
};
