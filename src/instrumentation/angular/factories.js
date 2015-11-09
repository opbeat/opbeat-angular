var utils = require('../utils')

module.exports = function ($provide, traceBuffer) {
  return {
    instrumentAll: function (modules) {
      modules.forEach(function (name) {
        $provide.decorator(name, function ($delegate, $injector) {
          utils.instrumentObject($delegate, $injector, {
            type: 'angular.factory',
            prefix: name
          })
          return $delegate
        })
      })
    }
  }
}