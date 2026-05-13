const { Keyboard } = require('grammy');

const BUTTONS = {
  PHOTO_ANALYSIS: '📸 анализ фото',
  BUILD_LOOK: '👗 собрать образ',
  COLORS: '🎨 цвета',
  MAKEUP: '💄 макияж',
  WHAT_SUITS: '🪞 что мне идет',
  NOT_TO_WEAR: '🚫 что не носить',
  PINTEREST_VIBE: '🖤 pinterest vibe',
  HONEST_REVIEW: '☕ честный разбор',
  CAPSULE: '🛍️ капсула',
  ABOUT: 'ℹ️ о боте',
};

const mainKeyboard = new Keyboard()
  .text(BUTTONS.PHOTO_ANALYSIS).text(BUTTONS.BUILD_LOOK)
  .row()
  .text(BUTTONS.COLORS).text(BUTTONS.MAKEUP)
  .row()
  .text(BUTTONS.WHAT_SUITS).text(BUTTONS.NOT_TO_WEAR)
  .row()
  .text(BUTTONS.PINTEREST_VIBE).text(BUTTONS.HONEST_REVIEW)
  .row()
  .text(BUTTONS.CAPSULE).text(BUTTONS.ABOUT)
  .resized();

const startHandler = async (ctx) => {
  await ctx.reply(
    `привет. я кира, твоя честная подруга-стилист.\n\nздесь без лишних восторгов: говорим по делу. кидай фото или выбирай режим в меню.`,
    { reply_markup: mainKeyboard }
  );
};

const aboutHandler = async (ctx) => {
  await ctx.reply(
    `стиль без цензуры и лишних эмодзи 🖤\n\nразбираю гардероб, подбираю цвета и честно говорю, что тебе не идет. использую gemini 2.5 flash для точности.`,
    { reply_markup: mainKeyboard }
  );
};

module.exports = {
  BUTTONS,
  mainKeyboard,
  startHandler,
  aboutHandler,
};
