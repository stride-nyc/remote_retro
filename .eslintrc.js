module.exports = {
  "parser": "babel-eslint",
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
    "afterEach": false,
    "Honeybadger": false,
    "DD_RUM": false,
    "mountWithConnectedSubcomponents": false,
    "ASSET_DOMAIN": false,
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
      2,
      { "SwitchCase": 1 },
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
    "object-curly-newline": "off",
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
    "no-alert": "off",
    "no-underscore-dangle": "off",
    "arrow-body-style": "off",
    "no-shadow": "off",
    "no-console": "off",
    "no-use-before-define": "off",
    "no-restricted-syntax": "off",
    "no-prototype-builtins": "off",
    "react/no-unescaped-entities": "off",
    "react/no-unused-prop-types": "off",
    "react/forbid-prop-types": "off",
    "react/jsx-one-expression-per-line": "off",
    "no-restricted-globals": "off",
    "jsx-a11y/no-autofocus": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/label-has-associated-control": {
      "some": [ "nesting", "id" ]
    },
    "jsx-a11y/label-has-for": {
      "some": [ "nesting", "id" ]
    },
    "import/no-named-as-default": "off",
    "no-unused-expressions": ["error", {"allowTernary": true}],
    "no-param-reassign": [2, { "props": false }],
  }
}
