/**
 * Returns the initial state for a new user session.
 */
function createInitialSessionData() {
  return {
    step: 'idle', // 'idle', 'onboarding_goal', 'onboarding_style', 'onboarding_budget'
    onboarding: {
      goal: null,
      style: null,
      budget: null,
      completed: false,
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
  };
}

module.exports = {
  createInitialSessionData,
};
