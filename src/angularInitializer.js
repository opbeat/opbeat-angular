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

  function noop () {}
  services['angularInitializer'] = {
    afterBootstrap: noop,
    beforeBootstrap: noop
  }

  function beforeBootstrap (modules) {
    services['angularInitializer'].beforeBootstrap()
  }

  function afterBootstrap () {
    services['angularInitializer'].afterBootstrap()
  }

  function opbeatBootstrap (fn, applyThis, applyArgs) {
    if (!alreadyRegistered) {
      alreadyRegistered = registerOpbeatModule(services)
    }
    var result
    if (services.configService.isPlatformSupported()) {
      beforeBootstrap()
      result = services.zoneService.runInOpbeatZone(fn, applyThis, applyArgs, 'angular:bootstrap')
      afterBootstrap()
    } else {
      result = fn.apply(applyThis, applyArgs)
    }
    return result
  }

  services.exceptionHandler = serviceFactory.getExceptionHandler()
  services.exceptionHandler.install()
  alreadyRegistered = registerOpbeatModule(services)
  patchAngularBootstrap(opbeatBootstrap)
}

function registerOpbeatModule (services) {
  return ngOpbeat(services)
}

module.exports = initialize
