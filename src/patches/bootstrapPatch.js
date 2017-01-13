var DEFER_LABEL = 'NG_DEFER_BOOTSTRAP!'
var deferRegex = new RegExp('^' + DEFER_LABEL + '.*')

function patchMainBootstrap (opbeatBootstrap, weDeferred) {
  if (typeof window.angular === 'undefined') {
    return
  }
  var originalBootstrapFn = window.angular.bootstrap

  function bootstrap (element, modules) {
    if (weDeferred && deferRegex.test(window.name)) {
      window.name = window.name.substring(DEFER_LABEL.length)
    }
    return opbeatBootstrap(originalBootstrapFn, window.angular, arguments)
  }

  Object.defineProperty(window.angular, 'bootstrap', {
    get: function () {
      if (typeof originalBootstrapFn === 'function') {
        return bootstrap
      } else {
        return originalBootstrapFn
      }
    },
    set: function (bootstrapFn) {
      originalBootstrapFn = bootstrapFn
    }
  })
}

function patchDeferredBootstrap (opbeatBootstrap) {
  if (typeof window.angular === 'undefined') {
    return
  }
  // If the bootstrap is already deferred. (like run by Protractor)
  // In this case `resumeBootstrap` should be patched
  if (deferRegex.test(window.name)) {
    var originalResumeBootstrap = window.angular.resumeBootstrap
    Object.defineProperty(window.angular, 'resumeBootstrap', {
      get: function () {
        if (typeof originalResumeBootstrap === 'function') {
          return function (modules) {
            return opbeatBootstrap(originalResumeBootstrap, window.angular, arguments)
          }
        } else {
          return originalResumeBootstrap
        }
      },
      set: function (resumeBootstrap) {
        originalResumeBootstrap = resumeBootstrap
      }
    })
    // we have not deferred the bootstrap
    return false
  } else { // If this is not a test, defer bootstrapping
    window.name = DEFER_LABEL + window.name

    window.angular.resumeDeferredBootstrap = function () {
      var modules = []
      return opbeatBootstrap(window.angular.resumeBootstrap, window.angular, [modules])
    }
    /* angular should remove DEFER_LABEL from window.name, but if angular is never loaded, we want
     to remove it ourselves */
    window.addEventListener('beforeunload', function () {
      if (deferRegex.test(window.name)) {
        window.name = window.name.substring(DEFER_LABEL.length)
      }
    })
    // we have deferred the bootstrap
    return true
  }
}

function createAngular (opbeatBootstrap) {
  // with this method we can initialize opbeat-angular before or after angular is loaded
  var alreadyPatched = false
  var originalAngular = window.angular
  // todo: check if defineProperty exists, add it isPlatformSupported
  // we don't support browsers that don't have defineProperty (IE<9)
  Object.defineProperty(window, 'angular', {
    get: function () {
      return originalAngular
    },
    set: function (value) {
      originalAngular = value
      if (!alreadyPatched && typeof originalAngular === 'object') {
        alreadyPatched = true
        patchAll(opbeatBootstrap)
      }
    },
    enumerable: true,
    configurable: true
  })
}

function patchAll (opbeatBootstrap) {
  var weDeferred = patchDeferredBootstrap(opbeatBootstrap)
  patchMainBootstrap(opbeatBootstrap, weDeferred)
}

function patchAngularBootstrap (zoneService, beforeBootstrap, afterBootstrap) {
  function opbeatBootstrap (fn, applyThis, applyArgs) {
    if (typeof beforeBootstrap === 'function') {
      beforeBootstrap()
    }
    var result = zoneService.runInOpbeatZone(fn, applyThis, applyArgs, 'angular:bootstrap')
    if (typeof afterBootstrap === 'function') {
      afterBootstrap()
    }
    return result
  }

  if (window.angular) {
    patchAll(opbeatBootstrap)
  } else {
    createAngular(opbeatBootstrap)
  }
}

module.exports = patchAngularBootstrap
