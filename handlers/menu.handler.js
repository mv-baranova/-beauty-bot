const { Keyboard } = require('grammy');

const BUTTONS = {
  PHOTO_ANALYSIS: '📸 анализ фото',
  BUILD_LOOK: '👗 собрать образ',
  COLORS: '🎨 цвета',
  MAKEUP: '💄 макияж',
  ASTROLOGY: '🔮 астрология',
  MATRIX: '🧬 матрица судьбы',
  WB_SHOPPING: '🛍️ подбор с WB',
  PREMIUM_LOOK: '💎 платный образ',
  RESTART: '🔄 перезапуск',
  ABOUT: 'ℹ️ о боте',
};

const mainKeyboard = new Keyboard()
  .text(BUTTONS.PHOTO_ANALYSIS).text(BUTTONS.BUILD_LOOK)
  .row()
  .text(BUTTONS.COLORS).text(BUTTONS.MAKEUP)
  .row()
  .text(BUTTONS.ASTROLOGY).text(BUTTONS.MATRIX)
  .row()
  .text(BUTTONS.WB_SHOPPING).text(BUTTONS.PREMIUM_LOOK)
  .row()
  .text(BUTTONS.RESTART).text(BUTTONS.ABOUT)
  .resized();

const startHandler = async (ctx) => {
  await ctx.reply(
    `привет! я мари, твоя стильная подруга. \n\nздесь мы разбираем стиль, заглядываем в звезды и собираем идеальные луки. \n\nвыбирай кнопку в меню или просто кидай фото для анализа 🤍`,
    { reply_markup: mainKeyboard }
  );
};

const aboutHandler = async (ctx) => {
  await ctx.reply(
    `я мари — твой проводник в мир эстетики. \n\nиспользую технологии gemini для глубокого анализа и свой вкус для твоих лучших образов. всё честно, по делу и с вайбом pinterest.`,
    { reply_markup: mainKeyboard }
  );
};

module.exports = {
  BUTTONS,
  mainKeyboard,
  startHandler,
  aboutHandler,
};
