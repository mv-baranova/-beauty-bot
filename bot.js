const { Bot } = require('grammy');
const config = require('./config');
const { startHandler, aboutHandler } = require('./handlers/menu.handler');
const { photoHandler } = require('./handlers/photo.handler');
const { textHandler } = require('./handlers/text.handler');

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
bot.hears('ℹ️ О боте', aboutHandler);

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
