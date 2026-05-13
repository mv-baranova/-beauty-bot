const { getFileAsBase64 } = require('../utils/image');
const { analyzeImage } = require('../services/gemini.service');
const config = require('../config');

const photoHandler = async (ctx) => {
  try {
    await ctx.reply('Вижу твое фото! Дай мне секунду, чтобы внимательно его изучить... ⏳✨');

    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const file = await ctx.api.getFile(photo.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${config.BOT_TOKEN}/${file.file_path}`;

    const base64Data = await getFileAsBase64(fileUrl);
    const analysis = await analyzeImage(base64Data);

    await ctx.reply(analysis);
  } catch (error) {
    console.error('Photo Analysis Error:', error);
    await ctx.reply(
      'Ой, что-то пошло не так при анализе фото... 😔 Попробуй еще раз или отправь другое фото, я обязательно справлюсь!'
    );
  }
};

module.exports = {
  photoHandler,
};
