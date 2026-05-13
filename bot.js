const { Bot } = require('grammy');
const config = require('./config');
const { startHandler, aboutHandler } = require('./handlers/menu.handler');
const { photoHandler } = require('./handlers/photo.handler');
const { textHandler } = require('./handlers/text.handler');
const { generateTextResponse } = require('./services/gemini.service');
const { PREMIUM_LOOK_PROMPT } = require('./prompts/stylist');

// Инициализация бота
const bot = new Bot(config.BOT_TOKEN);

// Глобальная обработка ошибок для стабильности
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  console.error(err.error);
});

// Регистрация команд
bot.command('start', startHandler);

// Регистрация текстовых кнопок
bot.hears('ℹ️ о боте', aboutHandler);

// Обработка платежей (Telegram Stars)
bot.on('pre_checkout_query', async (ctx) => {
  await ctx.answerPreCheckoutQuery(true);
});

bot.on('message:successful_payment', async (ctx) => {
  const statusMsg = await ctx.reply('оплата прошла! готовлю твой премиум образ... 💎');
  try {
    const response = await generateTextResponse(PREMIUM_LOOK_PROMPT, true); // true for complex/flash model
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    await ctx.reply(response);
  } catch (error) {
    console.error('Successful Payment Handler Error:', error);
    await ctx.reply('оплата прошла, но я запнулась при создании образа 😭 напиши в поддержку или попробуй нажать на любую кнопку.');
  }
});

// Обработка фото
bot.on('message:photo', photoHandler);

// Обработка всех остальных текстовых сообщений (включая остальные кнопки меню)
bot.on('message:text', textHandler);

// Запуск бота (Long Polling)
bot.start({
  onStart: () => {
    console.log('--- Mari AI Beauty Stylist Bot started ---');
    console.log(`Bot username: @${bot.botInfo.username}`);
  },
});
