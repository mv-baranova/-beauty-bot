const { Keyboard } = require('grammy');

const BUTTONS = {
  PHOTO: '✨ Анализ фото',
  OUTFIT: '👗 Подобрать образ',
  MAKEUP: '💄 Советы по макияжу',
  STYLE: '🎨 Цвета и стиль',
  ABOUT: 'ℹ️ О боте',
};

const mainKeyboard = new Keyboard()
  .text(BUTTONS.PHOTO).text(BUTTONS.OUTFIT)
  .row()
  .text(BUTTONS.MAKEUP).text(BUTTONS.STYLE)
  .row()
  .text(BUTTONS.ABOUT)
  .resized();

const startHandler = async (ctx) => {
  await ctx.reply(
    `Привет, дорогая! ✨\n\nЯ Кира — твой персональный AI-стилист. Я помогу тебе найти свой уникальный образ, разберу твой стиль по фото или просто дам совет по макияжу.\n\nВыбери то, что тебя интересует сегодня, или просто отправь мне фото! 👗💄`,
    { reply_markup: mainKeyboard }
  );
};

const aboutHandler = async (ctx) => {
  await ctx.reply(
    `Я — твой проводник в мир высокой моды и красоты. 💎\n\nИспользуя технологии искусственного интеллекта, я анализирую тренды и твои индивидуальные особенности, чтобы создавать безупречные образы.\n\nПросто доверься моему вкусу! ✨`,
    { reply_markup: mainKeyboard }
  );
};

module.exports = {
  BUTTONS,
  mainKeyboard,
  startHandler,
  aboutHandler,
};
