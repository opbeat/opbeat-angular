var opbeatCore = require('opbeat-js-core')
var patchUtils = opbeatCore.patchUtils
var utils = opbeatCore.utils
module.exports = function ($provide, transactionService) {
  $provide.decorator('$compile', ['$delegate', '$injector', function ($delegate, $injector) {
    var nameParts = ['$compile', 'compile']
    var traceType = 'template.$compile'

    var traceName = nameParts.join('.')

    function compile () {
      var trace = transactionService.startTrace(traceName, traceType, {enableStackFrames: false})
      try {
        var result = $delegate.apply(this, arguments)
      } finally {
        if (!utils.isUndefined(trace)) {
          trace.end()
        }
      }
      return result
    }

    patchUtils._copyProperties($delegate, compile)

    return compile
  }])
}
