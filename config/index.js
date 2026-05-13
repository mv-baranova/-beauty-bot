require('dotenv').config();

const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: "gemini-2.5-flash",
};

// Простая валидация
if (!config.BOT_TOKEN) {
  console.error("ERROR: BOT_TOKEN is missing in .env file");
  process.exit(1);
}

if (!config.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is missing in .env file");
  process.exit(1);
}

module.exports = config;
