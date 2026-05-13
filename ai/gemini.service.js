const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const { SYSTEM_PROMPT, PHOTO_ANALYSIS_PROMPT } = require('../prompts/stylist');
const { getProfileSummary } = require('../memory/profile.service');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// Models configuration
const MODELS = {
  MAIN: config.GEMINI_MODEL_MAIN || "gemini-3-flash",
  LITE: config.GEMINI_MODEL_LITE || "gemini-3-flash-lite",
  FALLBACK: config.GEMINI_MODEL_FALLBACK || "gemini-2.5-flash"
};

/**
 * Smart Fallback Manager: tries models in a priority chain.
 */
async function runWithFallback(taskType, payload, ctx) {
  const modelChain = [MODELS.MAIN, MODELS.LITE, MODELS.FALLBACK];
  let lastError;

  for (const modelId of modelChain) {
    try {
      console.log(`[AI Service] Trying model: ${modelId} for task: ${taskType}`);

      const model = genAI.getGenerativeModel({
        model: modelId,
        systemInstruction: SYSTEM_PROMPT,
      });

      let result;
      if (taskType === 'vision') {
        const { base64Data, mimeType, prompt } = payload;
        result = await model.generateContent([
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
          prompt,
        ]);
      } else {
        result = await model.generateContent(payload);
      }

      const response = await result.response;
      const text = response.text();

      console.log(`[AI Service] Success with model: ${modelId}`);
      return text;
    } catch (error) {
      lastError = error;
      const errorMsg = error.message || '';
      console.error(`[AI Service] Error with model ${modelId}:`, errorMsg);

      // If it's a critical error that fallback won't solve (like invalid API key), throw immediately
      if (errorMsg.includes('API_KEY_INVALID')) {
        throw error;
      }

      // Otherwise, continue to next model in chain (rate limits, quota, overload, etc.)
      continue;
    }
  }

  console.error('[AI Service] All models in fallback chain failed.');
  throw lastError;
}

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
 * Generates text response using fallback logic.
 */
async function generateTextResponse(userInput, ctx) {
  const context = ctx ? constructContext(ctx) : '';
  const fullInput = context ? `${context}\n\nЗАПРОС: ${userInput}` : userInput;

  try {
    return await runWithFallback('text', fullInput, ctx);
  } catch (error) {
    console.error('Final AI Error (Text):', error);
    return "прости, я сегодня немного перегружена 😭 попробуй чуть позже, я обязательно всё разберу!";
  }
}

/**
 * Analyzes image using fallback logic.
 */
async function analyzeImage(base64Data, mimeType = 'image/jpeg', ctx) {
  const context = ctx ? constructContext(ctx) : '';
  const prompt = context ? `${context}\n\n${PHOTO_ANALYSIS_PROMPT}` : PHOTO_ANALYSIS_PROMPT;

  try {
    return await runWithFallback('vision', { base64Data, mimeType, prompt }, ctx);
  } catch (error) {
    console.error('Final AI Error (Vision):', error);
    throw error; // Rethrow to let the handler show the specific error message
  }
}

/**
 * Specialized generation for specific prompts (like astrology or image gen)
 */
async function generateWithPrompt(customPrompt, userInput, ctx) {
  const context = ctx ? constructContext(ctx) : '';
  const fullInput = `${context}\n\nИНСТРУКЦИЯ К ЗАДАЧЕ: ${customPrompt}\n\nВВОДНЫЕ ДАННЫЕ: ${userInput}`;

  try {
    return await runWithFallback('prompt', fullInput, ctx);
  } catch (error) {
    console.error('Final AI Error (Custom Prompt):', error);
    throw error;
  }
}

module.exports = {
  generateTextResponse,
  analyzeImage,
  generateWithPrompt,
  runWithFallback
};
