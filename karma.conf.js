var karmaUtils = require('opbeat-test/karma-utils')
module.exports = function (config) {
  var karmaConfig = karmaUtils.getKarmaConfig(config, {
    packageVersion: require('./package').version
  })
  var files = [
    'test/utils/polyfill.js',
    'node_modules/angular/angular.js',
    'node_modules/angular-resource/angular-resource.js',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/angular-mocks/angular-mocks.js',
    { pattern: 'src/**/*.js', included: false, watched: true }
  ]
  karmaConfig.files = files.concat(karmaConfig.files)

  if (process.env.ANGULAR_VERSION) {
    console.log('Environment ANGULAR_VERSION: ' + process.env.ANGULAR_VERSION)
  }

  config.set(karmaConfig)
}
