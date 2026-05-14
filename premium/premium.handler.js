const keyboards = require('../utils/keyboards');
const { generateTextResponse } = require('../ai/gemini.service');

const premiumHandler = async (ctx) => {
  if (ctx.session.isPremium) {
    return await ctx.reply('💎 у тебя уже активен PREMIUM уровень! все функции доступны ✨', {
      reply_markup: keyboards.postAnalysis
    });
  }

  await ctx.reply(
    `💎 ПЕРЕХОДИ НА PREMIUM\n\nразблокируй секретные функции мари:\n\n✨ неограниченная генерация образов\n🖤 доступ к pinterest aesthetic разборам\n👗 виртуальная примерка стиля\n📸 fashion shot & moodboards\n🧬 глубокий разбор матрицы судьбы\n\nвыбери свой план:`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '💎 VIP STYLIST (все включено) — 499☆', callback_data: 'premium_buy_vip' }],
          [{ text: '✨ PREMIUM (базовый) — 199☆', callback_data: 'premium_buy_premium' }],
          [{ text: '☁️ оставить FREE', callback_data: 'premium_free' }]
        ]
      }
    }
  );
};

module.exports = {
  premiumHandler,
};
