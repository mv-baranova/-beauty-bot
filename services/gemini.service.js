const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const { SYSTEM_PROMPT, PHOTO_ANALYSIS_PROMPT } = require('../prompts/stylist');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: SYSTEM_PROMPT,
});

async function generateTextResponse(userInput) {
  try {
    const result = await model.generateContent(userInput);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error (Text):', error);
    throw error;
  }
}

async function analyzeImage(base64Data, mimeType = 'image/jpeg') {
  try {
    const result = await model.generateContent([
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
    console.error('Gemini API Error (Image):', error);
    throw error;
  }
}

module.exports = {
  generateTextResponse,
  analyzeImage,
};
