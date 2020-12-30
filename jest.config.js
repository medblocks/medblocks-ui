module.exports = {
    transform: {
        "^.+\\.svelte$": [
          "svelte-jester",
          {
            "preprocess": true
          }
        ],
        "^.+\\.js$": "babel-jest",
        "^.+\\.ts$": "ts-jest"
      },
    moduleFileExtensions: ['js', 'json', 'svelte', 'ts'],
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"]
  }
  