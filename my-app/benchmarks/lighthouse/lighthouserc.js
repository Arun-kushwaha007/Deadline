module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost:5173/login',
        'http://localhost:5173/register',
        'http://localhost:5173/',
        'http://localhost:5173/tasks',
      ],
      startServerCommand: 'npm run start',
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-reports',
      reportFilename: 'report.json',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
  },
};
