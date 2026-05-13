const { getFileAsBase64 } = require('../utils/image');
const { analyzeImage } = require('../services/gemini.service');
const config = require('../config');
const keyboards = require('../utils/keyboards');

const photoHandler = async (ctx) => {
  let statusMsg;
  try {
    statusMsg = await ctx.reply('смотрю фото 👀');

    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    if (!photo) {
      throw new Error('No photo found in message');
    }

    const fileId = photo.file_id;
    const file = await ctx.api.getFile(fileId);

    if (!file.file_path) {
      throw new Error('File path is missing from Telegram API response');
    }

    const fileUrl = `https://api.telegram.org/file/bot${config.BOT_TOKEN}/${file.file_path}`;

    // Determine mime type from file path extension
    const extension = file.file_path.split('.').pop().toLowerCase();
    const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';

    await ctx.api.editMessageText(ctx.chat.id, statusMsg.message_id, 'собираю pinterest board ✨');

    const base64Data = await getFileAsBase64(fileUrl);

    await ctx.api.editMessageText(ctx.chat.id, statusMsg.message_id, 'думаю над образом…');

    const analysis = await analyzeImage(base64Data, mimeType, ctx);

    // Save to history in session
    ctx.session.history.push({
      date: new Date().toISOString(),
      analysis,
      fileId,
    });

    // Limit history to 10 entries
    if (ctx.session.history.length > 10) {
      ctx.session.history.shift();
    }

    // Delete status message and send analysis with inline keyboard
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
    await ctx.reply(analysis, {
      reply_markup: keyboards.postAnalysis,
    });
  } catch (error) {
    console.error('--- PHOTO ANALYSIS ERROR ---');
    console.error('Error message:', error.message);
    console.error('---------------------------');

    const errorText = 'фото не прочиталось 😭\nпопробуй другое — лучше светлее и без сильного сжатия';

    if (statusMsg) {
      try {
        await ctx.api.editMessageText(ctx.chat.id, statusMsg.message_id, errorText);
      } catch (editError) {
        await ctx.reply(errorText);
      }
    } else {
      await ctx.reply(errorText);
    }
  }
};

module.exports = {
  photoHandler,
};
