function init () {
  var app = angular.module('noRouter', ['ngOpbeat'])

  app.config(function ($opbeatProvider) {
    $opbeatProvider.config({
      debug: true,
      orgId: '7f9fa667d0a349dd8377bc740bcfc33e',
      appId: '0a8757798e',
      performance: {
        enable: true,
        enableStackFrames: true,
        capturePageLoad: true
      }
    })
  })
}

function bootstrap (element) {
  window.angular.bootstrap(element, ['noRouter'])
}

module.exports = {
  init: init,
  bootstrap: bootstrap,
  appName: 'noRouter'
}
