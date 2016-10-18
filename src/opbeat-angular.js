var opbeatCore = require('opbeat-js-core')
var ServiceFactory = opbeatCore.ServiceFactory
var angularInitializer = require('./angularInitializer')
require('zone.js')
function init () {
  var serviceFactory = new ServiceFactory()
  angularInitializer(serviceFactory)
}

init()
