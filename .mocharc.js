module.exports={
    color: true,
    reporter: 'dot',
    spec: 'test/**/*_test.js',
    // newer Node 20.x patch releases auto-detect ESM by source heuristics,
    // which misfires on our JSX test files and skips the CommonJS/Babel
    // pipeline below - force the pre-auto-detect module resolution.
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


