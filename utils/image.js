const fetch = require('node-fetch');

/**
 * Downloads a file from Telegram and converts it to base64.
 * @param {string} fileUrl
 * @returns {Promise<string>}
 */
async function getFileAsBase64(fileUrl) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const buffer = await response.buffer();
    return buffer.toString('base64');
  } catch (error) {
    console.error('Error in getFileAsBase64:', error);
    throw error;
  }
}

module.exports = {
  getFileAsBase64,
};
