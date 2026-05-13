const { Keyboard } = require('grammy');

const BUTTONS = {
  STYLE_ANALYSIS: '✨ Разобрать мой стиль',
  PHOTO_ANALYSIS: '📸 Анализ фото',
  OUTFIT: '👗 Собрать образ',
  MAKEUP: '💄 Макияж',
  NOT_FOR_ME: '🎀 Что мне не идет',
  PINTEREST: '🖤 Pinterest vibe',
  ROAST: '☕ Fashion roast',
  ABOUT: 'ℹ️ О боте',
};

const mainKeyboard = new Keyboard()
  .text(BUTTONS.STYLE_ANALYSIS).text(BUTTONS.PHOTO_ANALYSIS)
  .row()
  .text(BUTTONS.OUTFIT).text(BUTTONS.MAKEUP)
  .row()
  .text(BUTTONS.NOT_FOR_ME).text(BUTTONS.PINTEREST)
  .row()
  .text(BUTTONS.ROAST).text(BUTTONS.ABOUT)
  .resized();

const startHandler = async (ctx) => {
  await ctx.reply(
    `приветик! ✨\n\nя кира, твоя личная стилист-подруга. помогу тебе разобраться с гардеробом, макияжем или просто накидаю pinterest вайба.\n\nприсылай фото или выбирай, что будем делать сегодня 🥂`,
    { reply_markup: mainKeyboard }
  );
};

const aboutHandler = async (ctx) => {
  await ctx.reply(
    `я твой проводник в мир моды и эстетики 💎\n\nиспользую свой вкус (и немного ai), чтобы делать тебя еще прекраснее. просто доверься, мы сделаем конфетку 🤍`,
    { reply_markup: mainKeyboard }
  );
};

module.exports = {
  BUTTONS,
  mainKeyboard,
  startHandler,
  aboutHandler,
};
