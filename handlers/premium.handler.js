const { InlineKeyboard } = require('grammy');

/**
 * Handles premium features and pricing UI.
 */
async function premiumHandler(ctx) {
  const text = `
💎 выбери свой уровень стиля:

☁️ FREE
- базовые разборы фото
- советы по стилю
- limited память (3 последних сообщения)

✨ PREMIUM
- глубокий разбор style dna
- полная память и персонализация
- расширенная астрология и матрица
- гайд по цветам и макияжу
- доступ к разделу "что купить"

💎 VIP STYLIST
- всё из premium
- генерация персональных образов (ai try-on)
- приоритетная поддержка
- персональный moodboard на месяц

выбирай свой vibe 🤍
  `.trim();

  const keyboard = new InlineKeyboard()
    .text('FREE (текущий)', 'premium_free').row()
    .text('✨ PREMIUM — 499₽', 'premium_buy_basic').row()
    .text('💎 VIP STYLIST — 999₽', 'premium_buy_vip');

  await ctx.reply(text, { reply_markup: keyboard });
}

module.exports = {
  premiumHandler,
};
