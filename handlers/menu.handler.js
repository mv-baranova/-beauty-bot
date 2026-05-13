const { Keyboard } = require('grammy');
const keyboards = require('../utils/keyboards');

const BUTTONS = {
  PHOTO_ANALYSIS: '📸 анализ фото',
  BUILD_LOOK: '👗 собрать образ',
  COLORS: '🎨 цвета',
  MAKEUP: '💄 макияж',
  ASTROLOGY: '🔮 астрология',
  MATRIX: '🧬 матрица судьбы',
  WB_SEARCH: '🛍️ подбор с WB',
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
  .text(BUTTONS.WB_SEARCH).text(BUTTONS.PREMIUM_LOOK)
  .row()
  .text(BUTTONS.RESTART).text(BUTTONS.ABOUT)
  .resized();

const startHandler = async (ctx) => {
  // If user is already completed onboarding, just show welcome
  if (ctx.session.onboarding.completed) {
    return await ctx.reply(
      `привет снова ✨\nготовы обновлять твой style DNA? скидывай фото или выбирай кнопку 🤍`,
      { reply_markup: mainKeyboard }
    );
  }

  // Start onboarding
  ctx.session.step = 'onboarding_goal';
  await ctx.reply(
    `привет, дорогая ✨\n\nя мари, твоя AI подружка-стилист. помогу тебе найти тот самый vibe.\n\nдавай быстро настроим твой профиль. какая у нас цель?`,
    { reply_markup: keyboards.onboardingGoal }
  );
};

const aboutHandler = async (ctx) => {
  await ctx.reply(
    `мари — это твой персональный AI стилист в кармане ☁️\n\nя анализирую твою внешность, подбираю образы, даю советы по макияжу и даже заглядываю в твою матрицу судьбы, чтобы понять твой истинный стиль.\n\nвсё по любви и с pinterest вайбом 🤍`,
    { reply_markup: mainKeyboard }
  );
};

const restartHandler = async (ctx) => {
  const { createInitialSessionData } = require('../utils/session');
  ctx.session = createInitialSessionData();
  await ctx.reply('🔄 всё обнулила! давай начнем сначала ✨');
  return startHandler(ctx);
};

module.exports = {
  BUTTONS,
  mainKeyboard,
  startHandler,
  aboutHandler,
  restartHandler,
};
