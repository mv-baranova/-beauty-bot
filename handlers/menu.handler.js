const { Keyboard } = require('grammy');

const BUTTONS = {
  PHOTO_ANALYSIS: '📸 анализ фото',
  BUILD_LOOK: '👗 собрать образ',
  MAKEUP: '💄 макияж',
  COLORS: '🎨 цвета',
  PINTEREST_VIBE: '🖤 pinterest vibe',
  WHAT_NOT_TO_WEAR: '🎀 что мне не идет',
  FASHION_ROAST: '☕ fashion roast',
  ABOUT: 'ℹ️ о боте',
};

const mainKeyboard = new Keyboard()
  .text(BUTTONS.PHOTO_ANALYSIS).text(BUTTONS.BUILD_LOOK)
  .row()
  .text(BUTTONS.MAKEUP).text(BUTTONS.COLORS)
  .row()
  .text(BUTTONS.PINTEREST_VIBE).text(BUTTONS.WHAT_NOT_TO_WEAR)
  .row()
  .text(BUTTONS.FASHION_ROAST).text(BUTTONS.ABOUT)
  .resized();

const startHandler = async (ctx) => {
  await ctx.reply(
    `привет, дорогая ✨\n\nя кира, твоя подружка-стилист. скидывай фото для анализа или выбирай кнопку в меню 🤍`,
    { reply_markup: mainKeyboard }
  );
};

const aboutHandler = async (ctx) => {
  await ctx.reply(
    `я твой карманный стилист с pinterest вайбом ☁️\n\nпомогаю найти свой стиль, разобрать ошибки и просто поболтать о моде. всё анонимно и очень эстетично 🤍`,
    { reply_markup: mainKeyboard }
  );
};

module.exports = {
  BUTTONS,
  mainKeyboard,
  startHandler,
  aboutHandler,
};
