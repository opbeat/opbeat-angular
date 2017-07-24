var opbeatCore = require('opbeat-js-core')
var ServiceFactory = opbeatCore.ServiceFactory
var angularInitializer = require('./angularInitializer')

require('opbeat-zone')
function init () {
  var serviceFactory = new ServiceFactory()
  if (window.opbeatApi && window.opbeatApi.serviceFactory) {
    serviceFactory = window.opbeatApi.serviceFactory
  }
  angularInitializer(serviceFactory)
}

init()
