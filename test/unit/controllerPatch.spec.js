var patchController = require('../../src/patches/controllerPatch')

describe('controllerPatch', function () {
  var opbeatCore = require('opbeat-js-core')
  var ConfigService = opbeatCore.ConfigService
  var TransactionService = opbeatCore.TransactionService

  var ZoneServiceMock = require('opbeat-js-core/test/performance/zoneServiceMock')
  var ServiceFactory = opbeatCore.ServiceFactory

  var config

  var zoneServiceMock
  var logger
  var app
  var angular = window.angular
  var trService

  beforeEach(function () {
    var serviceFactory = new ServiceFactory()
    config = new ConfigService()
    config.init()
    serviceFactory.services['ConfigService'] = config
    serviceFactory.services['Logger'] = logger = Object.create(serviceFactory.getLogger())
    spyOn(logger, 'debug')

    zoneServiceMock = new ZoneServiceMock()

    trService = new TransactionService(zoneServiceMock, logger, config)
    spyOn(trService, 'startTrace')

    app = angular.module('patchModule', ['ng'])

    app.config(function ($provide) {
      patchController($provide, trService)
    })
  })

  it('should include the registered name if available instead of the function name', function () {
    app.controller('testController', function t ($scope) {})

    angular.bootstrap('<div ng-controller="testController"></div>', ['patchModule'])

    expect(trService.startTrace).toHaveBeenCalledWith('$controller.testController', 'app.$controller', { 'enableStackFrames': false })
  })

  it('should include the function name for inline controllers if function.name is supported', function () {
    function test () {}
    app.directive('testDirective', function () {
      return {
        controller: test,
        template: '<div></div>'
      }
    })
    angular.bootstrap('<div test-directive=""></div>', ['patchModule'])

    if (test.name) {
      expect(trService.startTrace).toHaveBeenCalledWith('$controller.test', 'app.$controller', { 'enableStackFrames': false })
    } else {
      expect(trService.startTrace).not.toHaveBeenCalled()
    }
  })
})
