// babel.config.cjs
module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      "@babel/env",
      {
        "modules": "commonjs", // Use CommonJS modules for Node.js
        "useBuiltIns": "entry",
        "corejs": 3,
      },
    ],
    "@babel/preset-react",
  ]
  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "react-hot-loader/babel",
  ]

  // Ensure @babel/register handles .jsx
  require("@babel/register")({
    presets,
    plugins,
    extensions: [".js", ".jsx"], // Explicitly include .jsx
    ignore: [], // Ensure no files are ignored
  })

  return {
    presets,
    plugins,
    env: {
      test: {
        presets: [
          [
            "@babel/env", {
              "useBuiltIns": "entry",
              "corejs": 3,
              "modules": "commonjs",
            },
          ],
          "@babel/preset-react",
        ],
        plugins: ["@babel/plugin-proposal-object-rest-spread"],
      },
    },
  }
}
