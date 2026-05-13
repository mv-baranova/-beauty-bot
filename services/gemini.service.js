const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const { SYSTEM_PROMPT, PHOTO_ANALYSIS_PROMPT } = require('../prompts/stylist');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

const modelLite = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  systemInstruction: SYSTEM_PROMPT,
});

const modelFlash = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: SYSTEM_PROMPT,
});

function isQuotaError(error) {
  const msg = error.message || '';
  return msg.includes('429') ||
         msg.toLowerCase().includes('quota') ||
         msg.toLowerCase().includes('resource exhausted');
}

async function generateTextResponse(userInput, complex = false) {
  try {
    const model = complex ? modelFlash : modelLite;
    const result = await model.generateContent(userInput);
    const response = await result.response;
    return response.text();
  } catch (error) {
    if (isQuotaError(error)) {
      return "я сегодня уже перегрелась от разборов 😭\nпопробуй чуть позже";
    }
    console.error('Gemini API Error (Text):', error);
    throw error;
  }
}

async function analyzeImage(base64Data, mimeType = 'image/jpeg') {
  try {
    const result = await modelFlash.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
      PHOTO_ANALYSIS_PROMPT,
    ]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    if (isQuotaError(error)) {
      return "я сегодня уже перегрелась от разборов 😭\nпопробуй чуть позже";
    }
    console.error('Gemini API Error (Image):', error);
    throw error;
  }
}

module.exports = {
  generateTextResponse,
  analyzeImage,
};
