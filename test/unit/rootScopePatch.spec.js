var patchRootScope = require('../../src/patches/rootScopePatch')
var opbeatCore = require('opbeat-js-core')
var TransactionService = opbeatCore.TransactionService
var logger = require('loglevel')
var ZoneServiceMock = opbeatCore.test.ZoneServiceMock

var Config = opbeatCore.ConfigService

describe('angular.rootScopePatch', function () {
  it('should call startTrace for $scope.$digest', function () {
    var angular = window.angular
    var app = angular.module('patchModule', ['ng'])

    var config = Object.create(Config)
    config.init()
    var trService = new TransactionService(new ZoneServiceMock(), logger, config)
    spyOn(trService, 'startTrace')

    app.config(function ($provide) {
      patchRootScope($provide, trService)
    })
    var injector = angular.injector(['patchModule'])

    trService.startTransaction('transaction', 'transaction', {})

    var rootScope = injector.get('$rootScope')
    rootScope.$digest()
    expect(trService.startTrace).toHaveBeenCalledWith('$scope.$digest', 'app.$digest', { 'enableStackFrames': false })
  })
})
