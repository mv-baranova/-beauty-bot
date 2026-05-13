const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const { SYSTEM_PROMPT, PHOTO_ANALYSIS_PROMPT } = require('../prompts/stylist');
const { getProfileSummary } = require('./profile.service');

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
 * Constructs context string for the AI based on user session.
 */
function constructContext(ctx) {
  const profile = getProfileSummary(ctx.session);
  const history = ctx.session.history.slice(-3).map(h => h.analysis).join('\n---\n');

  return `
КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
${profile}

ПОСЛЕДНИЕ РАЗБОРЫ:
${history || 'история пуста'}

ИНСТРУКЦИЯ: всегда учитывай этот контекст. если пользователь спрашивает "что мне идет", ссылайся на его типаж или прошлые разборы. если он просит "собрать образ", учитывай его любимые цвета и эстетику.
`.trim();
}

/**
 * Generates text response using the lite model.
 */
async function generateTextResponse(userInput, ctx) {
  try {
    const context = ctx ? constructContext(ctx) : '';
    const fullInput = context ? `${context}\n\nЗАПРОС: ${userInput}` : userInput;

    const result = await textModel.generateContent(fullInput);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error (Text):', error);
    // Fallback to vision model if lite fails
    try {
      const context = ctx ? constructContext(ctx) : '';
      const fullInput = context ? `${context}\n\nЗАПРОС: ${userInput}` : userInput;
      const result = await visionModel.generateContent(fullInput);
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
async function analyzeImage(base64Data, mimeType = 'image/jpeg', ctx) {
  try {
    const context = ctx ? constructContext(ctx) : '';
    const prompt = context ? `${context}\n\n${PHOTO_ANALYSIS_PROMPT}` : PHOTO_ANALYSIS_PROMPT;

    const result = await visionModel.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
      prompt,
    ]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error (Image):', error);
    throw error;
  }
}

/**
 * Specialized generation for specific prompts (like astrology or image gen)
 */
async function generateWithPrompt(customPrompt, userInput, ctx) {
  try {
    const context = ctx ? constructContext(ctx) : '';
    const fullInput = `${context}\n\nИНСТРУКЦИЯ К ЗАДАЧЕ: ${customPrompt}\n\nВВОДНЫЕ ДАННЫЕ: ${userInput}`;

    const result = await textModel.generateContent(fullInput);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error (Custom Prompt):', error);
    throw error;
  }
}

module.exports = {
  generateTextResponse,
  analyzeImage,
  generateWithPrompt
};
