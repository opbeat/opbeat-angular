var ngOpbeat = require('./ngOpbeat')
var patchAngularBootstrap = require('./patches/bootstrapPatch')
var patchCommon = require('opbeat-js-core').patchCommon

function initialize (serviceFactory) {
  var serviceContainer = serviceFactory.getPerformanceServiceContainer()
  var services = serviceContainer.services
  if (!services.configService.isPlatformSupported()) {
    services.logger.warn('Platform is not supported.')
  } else {
    serviceContainer.initialize()
  }

  var alreadyRegistered = false
  patchCommon(serviceContainer)

  function beforeBootstrap (modules) {
    if (!alreadyRegistered) {
      alreadyRegistered = registerOpbeatModule(services)
    }
  }

  services.exceptionHandler = serviceFactory.getExceptionHandler()
  alreadyRegistered = registerOpbeatModule(services)
  patchAngularBootstrap(services.zoneService, beforeBootstrap)
}

function registerOpbeatModule (services) {
  return ngOpbeat(services.transactionService, services.logger, services.configService, services.exceptionHandler)
}

module.exports = initialize
