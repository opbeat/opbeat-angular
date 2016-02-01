module.exports = function (config) {
  config.set({
    files: [
      'test/**/*.spec.js',
      { pattern: 'test/exceptions/data/*.js', included: false, watched: false }
    ],
    frameworks: ['browserify', 'jasmine'],
    preprocessors: {
      'test/**/*.spec.js': ['browserify']
    },
    plugins: [
      'karma-failed-reporter',
    // 'karma-chrome-launcher',
      'karma-phantomjs2-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-spec-reporter',
      'karma-browserify'
    ],
    browsers: ['PhantomJS2'], // Chrome, Firefox, PhantomJS2
    reporters: ['spec', 'failed'],
    browserify: {
      debug: true
    }
  })
};
