module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/missions',
        'http://localhost:3000/leaderboard',
        'http://localhost:3000/api/health'
      ],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'categories:pwa': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};