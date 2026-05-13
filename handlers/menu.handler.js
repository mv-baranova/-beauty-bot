const { Keyboard } = require('grammy');

const BUTTONS = {
  PHOTO_ANALYSIS: '📸 анализ фото',
  BUILD_LOOK: '👗 собрать образ',
  MAKEUP: '💄 макияж',
  COLORS: '🎨 цвета',
  PINTEREST_VIBE: '🖤 pinterest vibe',
  NOT_SUITS: '🎀 что мне не идет',
  FASHION_ROAST: '☕ fashion roast',
  ABOUT: 'ℹ️ о боте',
};

const mainKeyboard = new Keyboard()
  .text(BUTTONS.PHOTO_ANALYSIS).text(BUTTONS.BUILD_LOOK)
  .row()
  .text(BUTTONS.MAKEUP).text(BUTTONS.COLORS)
  .row()
  .text(BUTTONS.PINTEREST_VIBE).text(BUTTONS.NOT_SUITS)
  .row()
  .text(BUTTONS.FASHION_ROAST).text(BUTTONS.ABOUT)
  .resized();

const startHandler = async (ctx) => {
  await ctx.reply(
    `привет. я мари, твоя стильная подруга. \n\nздесь мы разбираем стиль без приторности и лишней лести. кидай фото или выбирай кнопку в меню.`,
    { reply_markup: mainKeyboard }
  );
};

const aboutHandler = async (ctx) => {
  await ctx.reply(
    `я мари — твой карманный стилист. \n\nразбираю образы, подбираю палитры и говорю прямо, если что-то не идет. всё по делу и с вайбом pinterest.`,
    { reply_markup: mainKeyboard }
  );
};

module.exports = {
  BUTTONS,
  mainKeyboard,
  startHandler,
  aboutHandler,
};
