module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "globals": {
    "describe": false,
    "it": false,
    "expect": false,
    "beforeEach": false,
    "afterEach": false
  },
  "extends": "airbnb",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "never"
    ],
    "arrow-parens": [
      "error",
      "as-needed",
    ],
    "comma-dangle": [
      "error",
      {
        "functions": "never",
        "objects": "always-multiline",
        "arrays": "always-multiline",
        "imports": "ignore",
        "exports": "ignore",
      }
    ],
    "no-shadow": "off",
    "no-console": "off",
    "no-use-before-define": "off",
    "react/no-unescaped-entities": "off",
    "jsx-a11y/no-static-element-interactions": 0,
  }
}
