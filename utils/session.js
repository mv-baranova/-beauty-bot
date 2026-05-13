/**
 * Returns the initial state for a new user session.
 */
function createInitialSessionData() {
  return {
    step: 'idle', // 'idle', 'onboarding_goal', 'onboarding_style', 'onboarding_budget', 'astro_date', 'astro_time', 'astro_city'
    onboarding: {
      goal: null,
      style: null,
      budget: null,
      completed: false,
    },
    userProfile: {
      name: null,
      vibe: null,
      colors: [],
      aesthetics: [],
      astrology: {
        birthDate: null,
        birthTime: null,
        birthCity: null,
        sign: null,
        venus: null,
        moon: null,
      },
      type: null,
      style: null,
      brands: [],
      recurringTopics: [],
    },
    history: [], // Array of style analyses
    preferences: {
      colors: [],
      vibe: null,
    },
    wardrobe: [],
    referrals: {
      code: null,
      invitedBy: null,
      count: 0,
    },
    isPremium: false,
    subscriptionTier: 'free', // 'free', 'premium', 'vip'
  };
}

module.exports = {
  createInitialSessionData,
};
