var angularInitializer = require('../../src/angularInitializer')

var opbeatCore = require('opbeat-js-core')
var ServiceFactory = opbeatCore.ServiceFactory

var ConfigService = opbeatCore.ConfigService

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
    // need this to make sure other tests are not affected by patching methods on angular since we are not using ZoneServiceMock.
    window.angular = Object.create(window.angular)
    serviceFactory = new ServiceFactory()
    config = new ConfigService()
    config.init()
    serviceFactory.services['ConfigService'] = config
    serviceContainer = serviceFactory.getPerformanceServiceContainer()
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
    // simulating loading angular after angularInitializer
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

  it('should consider isPlatformSupported', function () {
    serviceContainer.services.transactionService = undefined
    serviceContainer.services.configService.isPlatformSupported = function () {
      return false
    }

    angularInitializer(serviceFactory)
    window.angular.module('test', ['ngOpbeat'])

    var injector = window.angular.injector(['ng', 'test'])
    var $opbeat = injector.get('$opbeat')
    expect($opbeat).toEqual(jasmine.any(Object))
    expect($opbeat).toBeTruthy()

    var div = document.createElement('div')
    window.angular.bootstrap(div, ['test'])
    expect(div.className).toBe('ng-scope')
  })

  afterEach(function () {
    // Clean up side effects
    delete window.angular
    window.angular = originalAngular
    window.name = ''
    // this is to make sure next test does not use the old ngOpbeat module defined in angular from another test
    window.angular.module('ngOpbeat', ['non-existing-module'])
    window.onerror = originalOnError
  })
})
