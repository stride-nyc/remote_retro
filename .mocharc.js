module.exports={
    color: true,
    reporter: 'dot',
    spec: 'test/**/*_test.js',
    require: [
        'env-test',
        '@babel/register',
        'mock-css-modules',
        'mock-local-storage',
        'test/support/js/test_jsdom_setup.js',
        'test/support/js/test_helper.js',
    ],
}


