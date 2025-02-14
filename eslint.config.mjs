import react from "eslint-plugin-react"
import globals from "globals"
import babelParser from "@babel/eslint-parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import jsxA11y from "eslint-plugin-jsx-a11y"
import importPlugin from "eslint-plugin-import"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    ignores: [
      "**/_build/",
      "priv/static/",
      "web/static/js/phoenix.js",
      "web/static/js/polyfills/",
      "**/webpack.*.config.js",
      "deps/**/*.js",
      "node_modules/**",
    ],
  },
  {
    plugins: {
      react,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
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
      ecmaVersion: 2022,
      sourceType: "module",

      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-object-rest-spread",
          ],
        },
        ecmaFeatures: {
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
        "allowShortCircuit": true,
        "allowTernary": true,
        "allowTaggedTemplates": true,
      }],

      "no-param-reassign": [2, {
        props: false,
      }],
      "import/prefer-default-export": "off",
      "max-len": ["error", { 
        "code": 120,
        "ignoreComments": true,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
      }],
    },
  },
  {
    files: ["test/**/*.{js,jsx}"],
    rules: {
      "import/no-extraneous-dependencies": "off",
      "no-unused-expressions": "off",
      "import/prefer-default-export": "off",
    },
  }]
