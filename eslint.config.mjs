import react from "eslint-plugin-react"
import globals from "globals"
import babelParser from "babel-eslint"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [{
  ignores: [
    "**/_build/",
    "priv/static/",
    "web/static/js/phoenix.js",
    "web/static/js/polyfills/",
    "**/webpack.*.config.js",
    "deps/**/*.js",
  ],
}, ...compat.extends("airbnb"), {
  plugins: {
    react,
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      describe: false,
      it: false,
      expect: false,
      beforeEach: false,
      afterEach: false,
      Honeybadger: false,
      DD_RUM: false,
      mountWithConnectedSubcomponents: false,
      ASSET_DOMAIN: false,
    },

    parser: babelParser,
    ecmaVersion: 5,
    sourceType: "module",

    parserOptions: {
      ecmaFeatures: {
        experimentalObjectRestSpread: true,
        jsx: true,
      },
    },
  },

  rules: {
    indent: ["error", 2, {
      SwitchCase: 1,
    }],

    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "never"],
    "object-curly-newline": "off",
    "arrow-parens": ["error", "as-needed"],

    "comma-dangle": ["error", {
      functions: "never",
      objects: "always-multiline",
      arrays: "always-multiline",
      imports: "ignore",
      exports: "ignore",
    }],

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

    "jsx-a11y/label-has-associated-control": ["error", {
      some: ["nesting", "id"],
    }],

    "jsx-a11y/label-has-for": ["error", {
      some: ["nesting", "id"],
    }],

    "import/no-named-as-default": "off",

    "no-unused-expressions": ["error", {
      allowTernary: true,
    }],

    "no-param-reassign": [2, {
      props: false,
    }],
  },
},
{
  files: ["test/**/*.jsx"],
  rules: {
    "import/no-extraneous-dependencies": "off",
  },
}]
