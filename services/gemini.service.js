const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const { SYSTEM_PROMPT, PHOTO_ANALYSIS_PROMPT } = require('../prompts/stylist');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// Model for text (lite version)
const textModel = genAI.getGenerativeModel({
  model: config.GEMINI_MODEL_LITE || "gemini-2.5-flash-lite",
  systemInstruction: SYSTEM_PROMPT,
});

// Model for vision/complex tasks
const visionModel = genAI.getGenerativeModel({
  model: config.GEMINI_MODEL || "gemini-2.5-flash",
  systemInstruction: SYSTEM_PROMPT,
});

/**
 * Generates text response using the lite model.
 */
async function generateTextResponse(userInput) {
  try {
    const result = await textModel.generateContent(userInput);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error (Text):', error);
    // Fallback to vision model if lite fails
    try {
      const result = await visionModel.generateContent(userInput);
      const response = await result.response;
      return response.text();
    } catch (fallbackError) {
      console.error('Gemini API Fallback Error:', fallbackError);
      throw fallbackError;
    }
  }
}

/**
 * Analyzes image using the vision model.
 */
async function analyzeImage(base64Data, mimeType = 'image/jpeg') {
  try {
    const result = await visionModel.generateContent([
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
