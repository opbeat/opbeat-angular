var angularInitializer = require('../../src/angularInitializer')

var opbeatCore = require('opbeat-js-core')
var ZoneServiceMock = opbeatCore.test.ZoneServiceMock
var ServiceFactory = opbeatCore.ServiceFactory

var Config = opbeatCore.ConfigService

describe('angularInitializer', function () {
  var originalOnError
  var originalAngular
  var zoneService
  var serviceContainer
  var serviceFactory
  var config

  beforeEach(function () {
    originalOnError = window.onerror
    originalAngular = window.angular
    serviceFactory = new ServiceFactory()
    config = Object.create(Config)
    config.init()
    serviceFactory.services['ConfigService'] = config
    serviceContainer = serviceFactory.getPerformanceServiceContainer()
    zoneService = new ZoneServiceMock()
    serviceContainer.services.zoneService = zoneService
  })

  it('should inject with ngMock', function () {
    angularInitializer(serviceFactory)
    window.angular.module('test', ['ngOpbeat'])
    window.angular.injector(['ng', 'test'])

    window.inject(function ($location) {
      expect(typeof $location.url).toBe('function')
    })
  })

  it('should register after angular is loaded', function () {
    window.angular.module('test', ['ngOpbeat'])
    window.angular = undefined
    angularInitializer(serviceFactory)

    var bootstrapIsCalled = false
    var fakeAngular = window.angular = {
      bootstrap: function (element, modules) {
        originalAngular.injector(['ng', 'test'])
        bootstrapIsCalled = true
      },
      module: originalAngular.module.bind(originalAngular),
      version: {
        full: 'fullversion'
      }
    }
    fakeAngular.bootstrap('<div></div>', ['test'])
    expect(bootstrapIsCalled).toBeTruthy()
  })

  it('should install window.onerror', function () {
    window.onerror = undefined
    expect(window.onerror).toEqual(null)
    angularInitializer(serviceFactory)
    config.setConfig({appId: 'test', orgId: 'test'})
    expect(typeof window.onerror).toBe('function')
  })

  afterEach(function () {
    // Clean up side effects
    delete window.angular
    window.angular = originalAngular
    window.name = ''
    window.angular.module('ngOpbeat', ['non-existing-module'])
    window.onerror = originalOnError
  })
})
