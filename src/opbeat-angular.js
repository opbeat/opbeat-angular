var opbeatCore = require('opbeat-js-core')
var ServiceFactory = opbeatCore.ServiceFactory
var angularInitializer = require('./angularInitializer')

function init () {
  var serviceFactory = new ServiceFactory()
  angularInitializer(serviceFactory)
}

init()
