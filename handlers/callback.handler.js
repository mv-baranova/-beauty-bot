const { generateTextResponse, generateWithPrompt } = require('../services/gemini.service');
const { IMAGE_GEN_PROMPT } = require('../prompts/stylist');
const { generateImage } = require('../services/image.service');

/**
 * Handles callback queries from inline keyboards.
 */
async function callbackHandler(ctx) {
  const data = ctx.callbackQuery.data;

  // Onboarding: Goal
  if (data.startsWith('goal_')) {
    const goal = data.replace('goal_', '');
    ctx.session.onboarding.goal = goal;
    ctx.session.userProfile.vibe = goal; // Use goal as initial vibe
    ctx.session.step = 'onboarding_style';
    const keyboards = require('../utils/keyboards');
    await ctx.answerCallbackQuery();
    return await ctx.editMessageText('отлично ✨ а какой стиль тебе ближе?', {
      reply_markup: keyboards.onboardingStyle,
    });
  }

  // Onboarding: Style
  if (data.startsWith('style_')) {
    const style = data.replace('style_', '');
    ctx.session.onboarding.style = style;
    ctx.session.userProfile.style = style;
    ctx.session.userProfile.aesthetics = [style];
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
      `всё, профиль настроен! ✨\n\nтеперь скидывай фото для анализа или выбирай что-нибудь в меню. я готова 🤍`,
      { reply_markup: mainKeyboard }
    );
  }

  // Action buttons from analysis
  if (data.startsWith('action_')) {
    const action = data.replace('action_', '');
    await ctx.answerCallbackQuery();

    let prompt = '';
    switch(action) {
      case 'colors': prompt = 'какие цвета мне подойдут на основе последнего фото?'; break;
      case 'makeup': prompt = 'какой макияж мне сделать?'; break;
      case 'shop': prompt = 'что мне купить в первую очередь?'; break;
      case 'vibe': prompt = 'опиши мой pinterest vibe подробнее'; break;
      case 'roast': prompt = 'сделай fashion roast моего образа, но по-доброму и стильно'; break;
      case 'save':
        return await ctx.reply('сохранила твой разбор в style journal! 📸');
      case 'build_look': prompt = 'собери мне полный образ'; break;
    }

    const statusMsg = await ctx.reply('думаю... ✨');
    const response = await generateTextResponse(prompt, ctx);
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    return await ctx.reply(response);
  }

  // Visualizations/Try-on
  if (data === 'action_visualize') {
    await ctx.answerCallbackQuery();
    const statusMsg = await ctx.reply('создаю visual board... ✨');
    try {
      const visualPrompt = await generateWithPrompt(IMAGE_GEN_PROMPT, 'создай образ на основе моего профиля', ctx);
      const imageUrl = await generateImage(visualPrompt);
      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
      return await ctx.replyWithPhoto(imageUrl, { caption: 'твой персональный visual board ☁️' });
    } catch (e) {
      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
      return await ctx.reply('не удалось создать образ сейчас 😭');
    }
  }

  // Premium actions
  if (data.startsWith('premium_')) {
    await ctx.answerCallbackQuery();
    if (data === 'premium_free') {
      return await ctx.reply('у тебя уже активен базовый план 🤍');
    }
    const tier = data.replace('premium_buy_', '');
    // Mock payment success
    ctx.session.subscriptionTier = tier;
    ctx.session.isPremium = true;
    return await ctx.reply(`✨ ура! теперь у тебя уровень ${tier.toUpperCase()}. все функции разблокированы 🤍`);
  }

  await ctx.answerCallbackQuery();
}

module.exports = {
  callbackHandler,
};
