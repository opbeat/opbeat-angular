describe('ngOpbeat', function () {
  var opbeatCore = require('opbeat-js-core')

  var Config = opbeatCore.ConfigService
  var TransactionService = opbeatCore.TransactionService
  var ngOpbeat = require('../../src/ngOpbeat')
  var ZoneServiceMock = opbeatCore.test.ZoneServiceMock
  var ServiceFactory = opbeatCore.ServiceFactory

  var config

  var zoneServiceMock
  var logger
  var serviceContainer
  var transactionService
  var exceptionHandler
  beforeEach(function () {
    var serviceFactory = new ServiceFactory()
    config = Object.create(Config)
    config.init()
    serviceFactory.services['ConfigService'] = config
    serviceFactory.services['Logger'] = logger = Object.create(serviceFactory.getLogger())
    spyOn(logger, 'debug')
    serviceContainer = serviceFactory.getPerformanceServiceContainer()

    zoneServiceMock = new ZoneServiceMock()
    serviceContainer.services.zoneService = zoneServiceMock

    transactionService = new TransactionService(zoneServiceMock, logger, config)
    serviceContainer.services.transactionService = transactionService

    serviceContainer.services.angularInitializer = {
      afterBootstrap: function () {}
    }
    exceptionHandler = serviceFactory.getExceptionHandler()
    // serviceContainer.services.exceptionHandler = exceptionHandler

    spyOn(transactionService, 'startTrace')
    spyOn(transactionService, 'startTransaction')

    window.angular.module('patchModule', ['ngOpbeat'])
      .config(function ($provide) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$opbeat', function $ExceptionHandlerDecorator ($delegate, $opbeat) {
          return function $ExceptionHandler (exception, cause) {
            fail(exception)
            return $delegate(exception, cause)
          }
        }])
      })
  })

  // #region: Supported platforms
  if (Config.isPlatformSupported()) {
    it('should not start transactions if performance is disable', function () {
      ngOpbeat(serviceContainer.services)
      config.setConfig({appId: 'test', orgId: 'test', isInstalled: true, performance: {enable: false}})
      expect(config.isValid()).toBe(true)
      expect(config.get('performance.enable')).toBe(false)

      var angular = window.angular

      var injector = angular.bootstrap('<div></div>', ['patchModule'])
      injector.invoke(function ($rootScope) {
        $rootScope.$broadcast('$routeChangeStart')
        expect(logger.debug).toHaveBeenCalledWith('Performance monitoring is disable')
      })
    })

    it('should use ui.router $transition if available', function () {
      var angular = window.angular

      var onStartCallback
      function $transitions () {
        this.trans = {
          onStart: function (options, callback) {
            onStartCallback = callback
          }
        }
        this.$get = [function () {
          return this.trans
        }]
      }
      angular.module('patchModule')
        .provider('$transitions', $transitions)
        .config(function ($opbeatProvider) {
          $opbeatProvider.config({appId: 'test'})
          expect(config.get('appId')).toBe('test')
        })

      ngOpbeat(serviceContainer.services)

      var injector = angular.bootstrap('<div></div>', ['patchModule'])

      expect(typeof onStartCallback).toBe('function')
      onStartCallback({
        to: function () {
          return {name: 'route name'}
        }
      })
    })

    it('should register route change event listeners', function () {
      ngOpbeat(serviceContainer.services)

      var angular = window.angular
      angular.module('patchModule')
        .config(function ($provide, $opbeatProvider) {
          $opbeatProvider.config({appId: 'test'})
          expect(config.get('appId')).toBe('test')
        })

      var injector = angular.bootstrap('<div></div>', ['patchModule'])

      // ui router
      injector.invoke(function ($rootScope) {
        $rootScope.$broadcast('$stateChangeStart', {name: 'test ui route change'})
      })

      expect(transactionService.startTransaction).toHaveBeenCalledWith('test ui route change', 'route-change')

      // ng route
      injector.invoke(function ($rootScope) {
        $rootScope.$broadcast('$routeChangeStart', {$$route: {originalPath: 'test ng route change'}})
      })
      expect(transactionService.startTransaction).toHaveBeenCalledWith('test ng route change', 'route-change')
    })
  }
  // #endregion

  it('should set correct log level', function () {
    ngOpbeat(serviceContainer.services)
    expect(config.get('debug')).toBe(false)
    expect(config.get('logLevel')).toBe('warn')
    expect(logger.getLevel()).toBe(logger.levels.WARN)

    var angular = window.angular
    angular.module('patchModule')
      .config(function ($opbeatProvider) {
        $opbeatProvider.config({debug: true})
        expect(logger.getLevel()).toBe(logger.levels.DEBUG)

        $opbeatProvider.config({debug: true, logLevel: 'trace'})
        expect(logger.getLevel()).toBe(logger.levels.TRACE)

        $opbeatProvider.config({debug: false, logLevel: 'warn'})
        expect(logger.getLevel()).toBe(logger.levels.WARN)
      })

    angular.bootstrap('<div></div>', ['patchModule'])
  })

  it('should consider isPlatformSupported', function () {
    serviceContainer.services.transactionService = undefined
    serviceContainer.services.configService.isPlatformSupported = function () {
      return false
    }
    ngOpbeat(serviceContainer.services)

    var angular = window.angular
    angular.module('patchModule')
      .config(function ($provide, $opbeatProvider) {
        $opbeatProvider.config({appId: 'test'})
        expect(config.get('appId')).toBe('test')
      })

    var injector = angular.bootstrap('<div></div>', ['patchModule'])
    injector.invoke(function ($rootScope) {
      $rootScope.$broadcast('$routeChangeStart')
    })
  })

  xit('should consider if AngularJS is supported', function () {
    serviceContainer.services.transactionservice = undefined

    ngOpbeat(serviceContainer.services)
    var angular = window.angular
    angular.module('patchModule')
      .config(function ($opbeatProvider) {
        $opbeatProvider.config({appId: 'test'})
        expect(config.get('appId')).toBe('test')
      })

    var injector = angular.bootstrap('<div></div>', ['patchModule'])
    injector.invoke(function ($rootScope) {
      $rootScope.$broadcast('$routeChangeStart')
    })
  })

  it('should publish setInitialPageLoadName', function () {
    ngOpbeat(serviceContainer.services)
    expect(typeof window.opbeat.setInitialPageLoadName).toBe('function')
    window.opbeat.setInitialPageLoadName('hamid initial page load')
  })
})
