const { generateTextResponse } = require('../services/gemini.service');
const { BUTTONS } = require('./menu.handler');

const textHandler = async (ctx) => {
  // Пропускаем команды, они обрабатываются отдельно
  if (ctx.message.text.startsWith('/')) return;

  const buttonValues = Object.values(BUTTONS);

  // Если это не кнопка, отвечаем через ИИ
  if (!buttonValues.includes(ctx.message.text)) {
    try {
      await ctx.reply('Думаю над твоим вопросом... ✨');
      const response = await generateTextResponse(ctx.message.text);
      await ctx.reply(response);
    } catch (error) {
      console.error('Text Handler Error:', error);
      await ctx.reply('Прости, я немного задумалась... Повтори, пожалуйста, свой вопрос. ✨');
    }
  } else {
    // Для кнопок, которые не имеют специфичного хендлера (кроме "О боте")
    // Можем тоже отвечать через ИИ с контекстом кнопки
    try {
      await ctx.reply('Конечно! Сейчас подготовлю советы для тебя... ✨');
      const response = await generateTextResponse(`Расскажи подробнее про: ${ctx.message.text}`);
      await ctx.reply(response);
    } catch (error) {
      console.error('Button Handler Error:', error);
      await ctx.reply('Что-то пошло не так, но я все еще здесь! Попробуй нажать еще раз. ✨');
    }
  }
};

module.exports = {
  textHandler,
};
