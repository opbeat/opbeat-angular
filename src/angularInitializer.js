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

  function noop () {}
  services['angularInitializer'] = {
    afterBootstrap: noop
  }

  function afterBootstrap () {
    services['angularInitializer'].afterBootstrap()
  }

  services.exceptionHandler = serviceFactory.getExceptionHandler()
  services.exceptionHandler.install()
  alreadyRegistered = registerOpbeatModule(services)
  patchAngularBootstrap(services.zoneService, beforeBootstrap, afterBootstrap)
}

function registerOpbeatModule (services) {
  return ngOpbeat(services)
}

module.exports = initialize
