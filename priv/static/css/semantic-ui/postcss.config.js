const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    purgecss({
      content: [
        '**/*.heex',
        '**/*.jsx',
      ],
      skippedContentGlobs: ['**/node_modules/**'],
      keyframes: true,
      safelist: {
        greedy: [/modal/, /show/, /transition/],
      },
    }),
  ],
}
