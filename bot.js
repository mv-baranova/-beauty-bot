const { Bot, session } = require('grammy');
const config = require('./config');
const { createInitialSessionData } = require('./utils/session');
const { startHandler, aboutHandler, restartHandler, BUTTONS } = require('./handlers/menu.handler');
const { photoHandler } = require('./handlers/photo.handler');
const { textHandler } = require('./handlers/text.handler');
const { callbackHandler } = require('./handlers/callback.handler');
const { astrologyHandler, matrixHandler } = require('./handlers/entertainment.handler');
const { wbSearchHandler } = require('./handlers/shop.handler');
const { premiumHandler } = require('./premium/premium.handler');

// Инициализация бота
const bot = new Bot(config.BOT_TOKEN);

// Настройка сессий
bot.use(session({ initial: createInitialSessionData }));

// Глобальная обработка ошибок для стабильности
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  console.error(err.error);
});

// Регистрация команд
bot.command('start', startHandler);

// Регистрация текстовых кнопок
bot.hears(BUTTONS.ABOUT, aboutHandler);
bot.hears(BUTTONS.RESTART, restartHandler);
bot.hears(BUTTONS.ASTROLOGY, astrologyHandler);
bot.hears(BUTTONS.MATRIX, matrixHandler);
bot.hears(BUTTONS.WB_SEARCH, wbSearchHandler);
bot.hears(BUTTONS.PREMIUM_LOOK, premiumHandler);

// Обработка колбэков (инлайн кнопки)
bot.on('callback_query:data', callbackHandler);

// Обработка фото
bot.on('message:photo', photoHandler);

// Обработка всех остальных текстовых сообщений (включая остальные кнопки меню)
bot.on('message:text', textHandler);

// Запуск бота (Long Polling)
bot.start({
  onStart: () => {
    console.log('--- Kira AI Beauty Stylist Bot started ---');
    console.log(`Bot username: @${bot.botInfo.username}`);
  },
});
