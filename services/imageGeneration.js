/**
 * Placeholder for future image generation integration.
 */
async function generateImage(prompt) {
  console.log('Image generation is not enabled yet. Prompt:', prompt);
  return {
    success: false,
    message: "image generation is not enabled yet"
  };
}

module.exports = {
  generateImage
};
