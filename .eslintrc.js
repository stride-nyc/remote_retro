module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
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
  extends: "airbnb",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: "module",
  },
  plugins: [
    "react",
  ],
  rules: {
    indent: [
      "error",
      2,
      { SwitchCase: 1 },
    ],
    "linebreak-style": [
      "error",
      "unix",
    ],
    quotes: [
      "error",
      "double",
    ],
    semi: [
      "error",
      "never",
    ],
    "object-curly-newline": "off",
    "arrow-parens": [
      "error",
      "as-needed",
    ],
    "comma-dangle": [
      "error",
      {
        functions: "never",
        objects: "always-multiline",
        arrays: "always-multiline",
        imports: "ignore",
        exports: "ignore",
      },
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
    // airbnb sets assert: "both" (htmlFor *and* DOM nesting required); several
    // Semantic UI components (e.g. toggle checkboxes) rely on the input/label
    // being CSS siblings, so nesting isn't an option - htmlFor/id pairing
    // alone is a valid, WCAG-compliant association.
    "jsx-a11y/label-has-associated-control": ["error", { assert: "either" }],
    "import/no-named-as-default": "off",
    "react/jsx-props-no-spreading": "off",
    "import/no-import-module-exports": "off",
    "no-unused-expressions": ["error", { allowTernary: true }],
    "no-param-reassign": [2, { props: false }],
    // conflicts with the idiomatic Redux reducer signature used throughout
    // web/static/js/redux/*.js: `(state = initialState, action) => ...` -
    // state must stay positionally first, so this can't be satisfied without
    // breaking every reducer call site.
    "default-param-last": "off",
  },
}
