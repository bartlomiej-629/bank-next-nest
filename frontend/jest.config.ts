module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // Required for React testing
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to transform TypeScript files
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // For custom matchers like .toBeInTheDocument
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};  