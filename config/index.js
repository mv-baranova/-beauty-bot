require('dotenv').config();

const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  // Gemini Models
  GEMINI_MODEL_MAIN: "gemini-3-flash",
  GEMINI_MODEL_LITE: "gemini-3-flash-lite",
  GEMINI_MODEL_FALLBACK: "gemini-2.5-flash",

  // Image Generation
  IMAGE_PROVIDER: process.env.IMAGE_PROVIDER || 'mock', // mock, openai, replicate, fal
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  FAL_KEY: process.env.FAL_KEY,
};

// Validation
if (!config.BOT_TOKEN) {
  console.error("ERROR: BOT_TOKEN is missing in .env file");
  process.exit(1);
}

if (!config.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is missing in .env file");
  process.exit(1);
}

module.exports = config;
