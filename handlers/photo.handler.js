const { getFileAsBase64 } = require('../utils/image');
const { analyzeImage } = require('../services/gemini.service');
const config = require('../config');

const loadingMessages = [
  'смотрююю 👀',
  'подожди, собираю тебе pinterest board ✨',
  'думаю над образом 🖤',
];

const getRandomLoadingMessage = () => loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

const photoHandler = async (ctx) => {
  try {
    await ctx.reply(getRandomLoadingMessage());

    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const file = await ctx.api.getFile(photo.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${config.BOT_TOKEN}/${file.file_path}`;

    const base64Data = await getFileAsBase64(fileUrl);
    const analysis = await analyzeImage(base64Data);

    await ctx.reply(analysis.toLowerCase());
  } catch (error) {
    console.error('Photo Analysis Error:', error);
    await ctx.reply(
      'ой, что-то пошло не так... попробуй еще раз, я обязательно разберусь! 🤍'
    );
  }
};

module.exports = {
  photoHandler,
};
