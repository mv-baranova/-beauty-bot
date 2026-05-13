const { Keyboard } = require('grammy');
const keyboards = require('../utils/keyboards');
const { getProfileSummary } = require('../services/profile.service');

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
  MY_PROFILE: '👤 мой профиль',
  MY_STYLE: '🎀 мой стиль',
  MEMORY_CHECK: '🧠 что ты помнишь?',
};

const mainKeyboard = new Keyboard()
  .text(BUTTONS.PHOTO_ANALYSIS).text(BUTTONS.BUILD_LOOK)
  .row()
  .text(BUTTONS.COLORS).text(BUTTONS.MAKEUP)
  .row()
  .text(BUTTONS.ASTROLOGY).text(BUTTONS.MATRIX)
  .row()
  .text(BUTTONS.MY_PROFILE).text(BUTTONS.MY_STYLE)
  .row()
  .text(BUTTONS.MEMORY_CHECK).text(BUTTONS.PREMIUM_LOOK)
  .row()
  .text(BUTTONS.RESTART).text(BUTTONS.ABOUT)
  .resized();

const startHandler = async (ctx) => {
  // Try to set name from telegram
  if (!ctx.session.userProfile.name) {
    ctx.session.userProfile.name = ctx.from.first_name;
  }

  // If user is already completed onboarding, just show welcome
  if (ctx.session.onboarding.completed) {
    return await ctx.reply(
      `привет снова, ${ctx.session.userProfile.name} ✨\nготовы обновлять твой style DNA? скидывай фото или выбирай кнопку 🤍`,
      { reply_markup: mainKeyboard }
    );
  }

  // Start onboarding
  ctx.session.step = 'onboarding_goal';
  await ctx.reply(
    `привет, ${ctx.session.userProfile.name} ✨\n\nя мари, твоя AI подружка-стилист. помогу тебе найти тот самый vibe.\n\nдавай быстро настроим твой профиль. какая у нас цель?`,
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

const profileHandler = async (ctx) => {
  const summary = getProfileSummary(ctx.session);
  await ctx.reply(`👤 твой профиль:\n\n${summary}\n\nможешь просто написать мне, если хочешь что-то изменить 🤍`, { reply_markup: mainKeyboard });
};

const styleHandler = async (ctx) => {
  const lastAnalysis = ctx.session.history[ctx.session.history.length - 1];
  if (!lastAnalysis) {
    return await ctx.reply('я пока ничего не знаю о твоем стиле 😭 скинь фото для анализа!', { reply_markup: mainKeyboard });
  }
  await ctx.reply(`🎀 твой текущий style DNA:\n\n${lastAnalysis.analysis}`, { reply_markup: mainKeyboard });
};

const memoryHandler = async (ctx) => {
  const { generateTextResponse } = require('../services/gemini.service');
  const statusMsg = await ctx.reply('вспоминаю всё, что мы обсуждали... 🧠');
  const response = await generateTextResponse('расскажи кратко, что ты помнишь обо мне, моих предпочтениях и советах, которые ты давала. будь как подружка.', ctx);
  await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
  await ctx.reply(response, { reply_markup: mainKeyboard });
};

module.exports = {
  BUTTONS,
  mainKeyboard,
  startHandler,
  aboutHandler,
  restartHandler,
  profileHandler,
  styleHandler,
  memoryHandler
};
