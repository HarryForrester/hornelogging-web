module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transform JavaScript and JSX files using babel-jest
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|react-bootstrap)/)', // Process node_modules that use ES modules
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom', // Use jsdom for testing React components
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },
};
