const { generateTextResponse } = require('../services/gemini.service');
const { BUTTONS } = require('./menu.handler');

const textHandler = async (ctx) => {
  // Пропускаем команды, они обрабатываются отдельно
  if (ctx.message.text.startsWith('/')) return;

  const buttonValues = Object.values(BUTTONS);

  // Если это не кнопка, отвечаем через ИИ
  if (!buttonValues.includes(ctx.message.text)) {
    try {
      const response = await generateTextResponse(ctx.message.text);
      await ctx.reply(response.toLowerCase());
    } catch (error) {
      console.error('Text Handler Error:', error);
      await ctx.reply('прости, я немного задумалась... повтори, пожалуйста, свой вопрос ✨');
    }
  } else {
    // Для кнопок, которые не имеют специфичного хендлера
    try {
      await ctx.reply('сейчас всё придумаю... 🤍');
      const response = await generateTextResponse(`расскажи подробнее про: ${ctx.message.text}`);
      await ctx.reply(response.toLowerCase());
    } catch (error) {
      console.error('Button Handler Error:', error);
      await ctx.reply('что-то пошло не так, но я всё еще здесь! попробуй нажать еще раз 👀');
    }
  }
};

module.exports = {
  textHandler,
};
