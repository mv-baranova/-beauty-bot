/**
 * Service to manage user profile data within the session.
 */

/**
 * Updates the user profile with new data.
 * @param {Object} session - The grammY session object.
 * @param {Object} newData - The new profile data to merge.
 */
function updateProfile(session, newData) {
  if (!session.userProfile) {
    session.userProfile = {};
  }

  // Shallow merge for top-level properties, special handling for nested objects if needed
  Object.keys(newData).forEach(key => {
    if (key === 'astrology' && typeof newData[key] === 'object') {
      session.userProfile.astrology = {
        ...session.userProfile.astrology,
        ...newData[key]
      };
    } else if (Array.isArray(newData[key])) {
      // For arrays, we might want to append or replace. Let's replace for now, or merge unique.
      session.userProfile[key] = [...new Set([...(session.userProfile[key] || []), ...newData[key]])];
    } else {
      session.userProfile[key] = newData[key];
    }
  });
}

/**
 * Gets the user profile.
 * @param {Object} session - The grammY session object.
 * @returns {Object} The user profile.
 */
function getProfile(session) {
  return session.userProfile || {};
}

/**
 * Summarizes the profile for AI context.
 */
function getProfileSummary(session) {
  const p = session.userProfile;
  if (!p) return "нет данных о профиле";

  return `
имя: ${p.name || 'не указано'}
вайб: ${p.vibe || 'не определен'}
любимые цвета: ${p.colors.join(', ') || 'не указаны'}
эстетики: ${p.aesthetics.join(', ') || 'не указаны'}
типаж: ${p.type || 'не определен'}
стиль: ${p.style || 'не определен'}
бренды: ${p.brands.join(', ') || 'не указаны'}
астрология: ${p.astrology.birthDate ? `${p.astrology.birthDate}, ${p.astrology.birthCity}` : 'не указана'}
`.trim();
}

module.exports = {
  updateProfile,
  getProfile,
  getProfileSummary
};
