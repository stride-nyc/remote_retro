module.exports={
    color: true,
    reporter: 'dot',
    spec: 'test/**/*_test.js',
    // node's syntax-based ESM auto-detection (default since ~node 22, though
    // some 20.x patch releases already do it) sees the top-level `import`s in
    // these test files and loads them via the native ESM loader, bypassing
    // @babel/register's require() hook - which is what actually transpiles
    // their JSX. forcing plain commonjs require() restores that.
    'node-option': ['no-experimental-detect-module'],
    require: [
        'env-test',
        '@babel/register',
        'mock-css-modules',
        'mock-local-storage',
        'test/support/js/test_jsdom_setup.js',
        'test/support/js/test_helper.js',
    ],
}


