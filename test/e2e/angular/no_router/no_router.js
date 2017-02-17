function init () {
  var app = angular.module('noRouter', ['ngOpbeat'])
  var ctrl = require('../common/exponential_ctrl')

  var config = {
    // logLevel: 'trace',
    debug: true,
    orgId: '7f9fa667d0a349dd8377bc740bcfc33e',
    appId: '0a8757798e',
    performance: {
      enable: true,
      enableStackFrames: true,
      capturePageLoad: true,
      captureInteractions: true
    }
  }

  app.config(function ($opbeatProvider) {
    $opbeatProvider.config(config)
  })
  opbeat.setInitialPageLoadName('hamid')
  app.controller('expCtrl', ctrl)
}

function bootstrap (element) {
  window.angular.bootstrap(element, ['noRouter'])
}

module.exports = {
  init: init,
  bootstrap: bootstrap,
  appName: 'noRouter'
}
