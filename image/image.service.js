const config = require('../config');

/**
 * Abstraction layer for image generation.
 * Supports multiple providers through a factory pattern.
 */

const providers = {
  mock: require('./providers/mock.provider'),
  // Future providers can be added here
  // openai: require('./providers/openai.provider'),
  // replicate: require('./providers/replicate.provider'),
  // fal: require('./providers/fal.provider'),
};

/**
 * Generates an image based on a prompt using the configured provider.
 * @param {string} prompt - The visual description of the image.
 * @returns {Promise<string>} The URL or base64 of the generated image.
 */
async function generateImage(prompt) {
  const providerName = config.IMAGE_PROVIDER || 'mock';
  const provider = providers[providerName] || providers.mock;

  console.log(`[Image Service] Using provider: ${providerName}`);

  try {
    return await provider.generate(prompt);
  } catch (error) {
    console.error(`[Image Service] Error with provider ${providerName}:`, error);

    // Fallback to mock if the chosen provider fails
    if (providerName !== 'mock') {
      console.log('[Image Service] Falling back to mock provider');
      return await providers.mock.generate(prompt);
    }

    throw error;
  }
}

module.exports = {
  generateImage,
};
