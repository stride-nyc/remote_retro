// babel.config.cjs
module.exports = function (api) {
  api.cache(true)

  const presets = [
    ["@babel/env", {
      "modules": "commonjs", // Force CommonJS for Node compatibility
      "useBuiltIns": "entry",
      "corejs": 3,
    }],
    "@babel/preset-react",
    "@babel/preset-modules",
  ]

  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "react-hot-loader/babel",
  ]

  return {
    presets,
    plugins,
    sourceType: "unambiguous",
    env: {
      test: {
        presets: [
          ["@babel/env", {
            "modules": "commonjs", // Ensure CommonJS in test environment
            "useBuiltIns": "entry",
            "corejs": 3,
          }],
          "@babel/preset-react",
          "@babel/preset-modules",
        ],
        plugins: ["@babel/plugin-proposal-object-rest-spread"],
      },
    },
  }
}
