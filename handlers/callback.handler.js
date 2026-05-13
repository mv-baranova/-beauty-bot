/**
 * Handles callback queries from inline keyboards.
 */
async function callbackHandler(ctx) {
  const data = ctx.callbackQuery.data;

  // Onboarding: Goal
  if (data.startsWith('goal_')) {
    ctx.session.onboarding.goal = data.replace('goal_', '');
    ctx.session.step = 'onboarding_style';
    const keyboards = require('../utils/keyboards');
    await ctx.answerCallbackQuery();
    return await ctx.editMessageText('отлично ✨ а какой стиль тебе ближе?', {
      reply_markup: keyboards.onboardingStyle,
    });
  }

  // Onboarding: Style
  if (data.startsWith('style_')) {
    ctx.session.onboarding.style = data.replace('style_', '');
    ctx.session.step = 'onboarding_budget';
    const keyboards = require('../utils/keyboards');
    await ctx.answerCallbackQuery();
    return await ctx.editMessageText('поняла ☁️ и последнее — на какой бюджет обычно ориентируешься?', {
      reply_markup: keyboards.onboardingBudget,
    });
  }

  // Onboarding: Budget
  if (data.startsWith('budget_')) {
    ctx.session.onboarding.budget = data.replace('budget_', '');
    ctx.session.onboarding.completed = true;
    ctx.session.step = 'idle';
    const { mainKeyboard } = require('./menu.handler');
    await ctx.answerCallbackQuery();
    await ctx.deleteMessage();
    return await ctx.reply(
      'всё, профиль настроен! ✨\n\nтеперь скидывай фото для анализа или выбирай что-нибудь в меню. я готова 🤍',
      { reply_markup: mainKeyboard }
    );
  }

  // Action buttons from analysis
  if (data.startsWith('action_')) {
    const action = data.replace('action_', '');
    await ctx.answerCallbackQuery();

    // Simply trigger the text handler with the action name for now
    // or handle specific actions
    const { generateTextResponse } = require('../services/gemini.service');

    let prompt = '';
    switch(action) {
      case 'colors': prompt = 'какие цвета мне подойдут на основе последнего фото?'; break;
      case 'makeup': prompt = 'какой макияж мне сделать?'; break;
      case 'shop': prompt = 'что мне купить в первую очередь?'; break;
      case 'vibe': prompt = 'опиши мой pinterest vibe подробнее'; break;
      case 'roast': prompt = 'сделай fashion roast моего образа, но по-доброму и стильно'; break;
      case 'save':
        return await ctx.reply('сохранила твой разбор в style journal! 📸 (фича в разработке, но я запомнила)');
      case 'build_look': prompt = 'собери мне полный образ'; break;
    }

    const statusMsg = await ctx.reply('думаю... ✨');
    const response = await generateTextResponse(prompt);
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    return await ctx.reply(response);
  }

  await ctx.answerCallbackQuery();
}

module.exports = {
  callbackHandler,
};
