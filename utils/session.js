const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      state: 'idle',
      data: {}
    });
  }
  return sessions.get(userId);
}

function resetSession(userId) {
  sessions.set(userId, {
    state: 'idle',
    data: {}
  });
}

module.exports = {
  getSession,
  resetSession
};
