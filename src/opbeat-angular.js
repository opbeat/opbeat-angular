var opbeatCore = require('opbeat-js-core')
var ServiceContainer = opbeatCore.ServiceContainer
var ServiceFactory = opbeatCore.ServiceFactory
var angularInitializer = require('./angularInitializer')

function init () {
  var serviceFactory = new ServiceFactory()
  var serviceContainer = new ServiceContainer(serviceFactory)

  angularInitializer(serviceContainer)
}

init()
