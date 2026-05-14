const { generateWithPrompt } = require('../ai/gemini.service');
const { ASTROLOGY_PROMPT } = require('../prompts/stylist');
const { updateProfile } = require('../memory/profile.service');

/**
 * Multi-step data collection for astrology.
 */
async function astrologyHandler(ctx) {
  ctx.session.step = 'astro_date';
  await ctx.reply('🔮 окей, давай заглянем в твои звезды. напиши свою дату рождения (например: 12.05.1995) ☁️');
}

/**
 * Handles astrology-related text inputs based on current step.
 */
async function handleAstrologyInput(ctx) {
  const text = ctx.message.text;

  if (ctx.session.step === 'astro_date') {
    updateProfile(ctx.session, { astrology: { birthDate: text } });
    ctx.session.step = 'astro_time';
    return await ctx.reply('поняла ✨ а теперь напиши время рождения (если знаешь, если нет — пиши "не знаю")');
  }

  if (ctx.session.step === 'astro_time') {
    updateProfile(ctx.session, { astrology: { birthTime: text } });
    ctx.session.step = 'astro_city';
    return await ctx.reply('и последний штрих — город рождения 🏙');
  }

  if (ctx.session.step === 'astro_city') {
    updateProfile(ctx.session, { astrology: { birthCity: text } });
    ctx.session.step = 'idle';

    const statusMsg = await ctx.reply('считываю энергию планет... 🪐');

    try {
      const astroData = `дата: ${ctx.session.userProfile.astrology.birthDate}, время: ${ctx.session.userProfile.astrology.birthTime}, город: ${ctx.session.userProfile.astrology.birthCity}`;
      const response = await generateWithPrompt(ASTROLOGY_PROMPT, astroData, ctx);

      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
      await ctx.reply(response);
    } catch (error) {
      console.error('Astrology Generation Error:', error);
      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
      await ctx.reply('что-то звезды сегодня не в духе 😭 попробуй позже');
    }
  }
}

async function matrixHandler(ctx) {
  // Simple version for now
  ctx.session.step = 'matrix_date';
  await ctx.reply('🧬 матрица судьбы — это глубоко. напиши дату рождения, и я раскрою твой аркан стиля ✨');
}

async function handleMatrixInput(ctx) {
  const text = ctx.message.text;
  ctx.session.step = 'idle';

  const statusMsg = await ctx.reply('рассчитываю твою матрицу... 🧬');
  try {
    const prompt = 'проанализируй дату рождения с точки зрения матрицы судьбы и арканов. какой стиль и архетип подходит этому человеку? ответь в стиле мари.';
    const response = await generateWithPrompt(prompt, text, ctx);
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    await ctx.reply(response);
  } catch (error) {
    console.error('Matrix Generation Error:', error);
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    await ctx.reply('матрица сегодня дает сбой 😭 попробуй чуть позже');
  }
}

module.exports = {
  astrologyHandler,
  handleAstrologyInput,
  matrixHandler,
  handleMatrixInput
};
