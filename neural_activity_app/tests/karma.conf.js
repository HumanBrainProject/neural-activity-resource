// Karma configuration
// Generated on Thu Jan 04 2018 16:45:36 GMT+0100 (CET)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('jasmine-core'),
            require('karma-phantomjs-launcher'),
            require('karma-jasmine'),
            require('karma-spec-reporter'),
            require('karma-junit-reporter'),
        ],

        // list of files / patterns to load in the browser
        files: [

            //static files
            //lodash
            '../app/static/lodash/lodash.min.js',

            //hello
            '../app/static/hello/dist/hello.js',
            '../app/static/hello/dist/hello.all.js',

            //angular
            '../app/static/angular/angular.js',

            //angular-mocks
            '../app/static/angular-mocks/angular-mocks.js',
            // '../validation_service/app/static/angular-mocks/ngAnimateMock.js',
            // '../validation_service/app/static/angular-mocks/ngMock.js',

            //angular-cookies
            '../app/static/angular-cookies/angular-cookies.js',

            //angular-materials
            '../app/static/node_modules/angular-material/angular-material.js',

            //angular-bbp-config
            '../app/static/angular-bbp-config/angular-bbp-config.js',

            //bbp-oidc-client
            '../app/static/bbp-oidc-client/angular-bbp-oidc-client.js',

            //angular-bootstrap
            '../app/static/angular-bootstrap/ui-bootstrap-tpls.min.js',
            '../app/static/angular-bootstrap-multiselect/dist/angular-bootstrap-multiselect.js',


            //angular-uuid4
            '../app/static/angular-uuid4/angular-uuid4.js',

            //angular-ui-router
            '../app/static/angular-ui-router/release/angular-ui-router.min.js',

            //angular-resource
            '../app/static/angular-resource/angular-resource.min.js',

            //jquery
            '../app/static/jquery/dist/jquery.js',


            //hbp-collaboratory-theme
            '../app/static/hbp-collaboratory-theme/dist/javascripts/bootstrap.min.js',

            //nvd3
            '../app/static/d3/d3.js',
            '../app/static/nvd3/build/nv.d3.js',
            '../app/static/angular-nvd3-1.0.8/dist/angular-nvd3.js',

            //others
            '../app/static/ng-text-truncate-master/ng-text-truncate.js',

            '../app/static/moment-2.19.2/moment.js',
            '../app/static/angular-moment-1.1.0/angular-moment.js',

            '../app/static/palette.js-master/palette.js',

            //.js | files
            '../app/js/*.js',

            //.spec.js | test files
            './*.spec.js',
            './test_controllers/*.spec.js',
            './test_services/*.spec.js',

        ],


        // list of files / patterns to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}