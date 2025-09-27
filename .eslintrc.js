module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier", // Ensures Prettier's rules override ESLint's conflicting ones. Must be last.
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  rules: {
    // React 17+ new JSX transform doesn't require React in scope.
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    // Additional project-specific rules can be added here.
  },
  settings: {
    react: {
      version: "detect", // Automatically detects the React version.
    },
  },
  ignorePatterns: ["node_modules/", "dist/", "build/"], // Directories to be ignored by ESLint.
};
