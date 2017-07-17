var patchAngularBootstrap = require('../../src/patches/bootstrapPatch')
var opbeatCore = require('opbeat-js-core')
var ZoneServiceMock = require('opbeat-js-core/test/performance/zoneServiceMock')

describe('bootstrapPatch', function () {
  var originalAngular
  var zoneService
  var DEFER_LABEL = 'NG_DEFER_BOOTSTRAP!'
  var opbeatBootstrap

  function fakeBootstrap (fn, applyThis, applyArgs) {
    return fn.apply(applyThis, applyArgs)
  }

  beforeEach(function () {
    originalAngular = window.angular
    zoneService = new ZoneServiceMock()
    opbeatBootstrap = jasmine.createSpy('opbeatBootstrap').and.callFake(fakeBootstrap)
  })

  it('should call bootstrap', function () {
    // can't use spies since we're also patching bootstrap
    var bootstrapCalled = false
    zoneService.zone.name = '<root>'
    var fakeAngular = window.angular = {
      bootstrap: function (element, modules) {
        expect(element).toBe('document')
        expect(modules).toEqual(['modules'])
        expect(opbeatBootstrap).toHaveBeenCalled()
        bootstrapCalled = true
        expect(typeof window.angular.resumeDeferredBootstrap).toBe('function')
        window.angular.resumeBootstrap = jasmine.createSpy('resumeBootstrap')
        window.angular.resumeDeferredBootstrap()
        expect(window.angular.resumeBootstrap).toHaveBeenCalled()
      }
    }

    patchAngularBootstrap(opbeatBootstrap)
    fakeAngular.bootstrap('document', ['modules'])
    expect(opbeatBootstrap).toHaveBeenCalled()
    expect(bootstrapCalled).toBe(true)
  })

  it('should not call if angular is undefined', function () {
    window.angular = undefined
    patchAngularBootstrap(opbeatBootstrap)
    expect(opbeatBootstrap).not.toHaveBeenCalled()
    window.angular = {}
  })

  it('should not call opbeatBootstrap if bootstrap is undefined', function () {
    window.angular = {}
    patchAngularBootstrap(opbeatBootstrap)
    expect(opbeatBootstrap).not.toHaveBeenCalled()
  })

  it('should opbeatBootstrap after bootstrap is set but before it is called', function () {
    window.angular = {}
    patchAngularBootstrap(opbeatBootstrap)
    expect(opbeatBootstrap).not.toHaveBeenCalled()
    var bootstrapCalled = false
    window.angular.bootstrap = 'hamid'
    expect(window.angular.bootstrap).toBe('hamid')
    window.angular.bootstrap = function () {
      bootstrapCalled = true
    }
    window.angular.bootstrap()
    expect(opbeatBootstrap).toHaveBeenCalled()
    expect(bootstrapCalled).toBe(true)
  })

  it('should patch resumeBootstrap if bootstrap is already deferred', function () {
    window.name = DEFER_LABEL + window.name
    window.angular = {}
    patchAngularBootstrap(opbeatBootstrap)
    expect(opbeatBootstrap).not.toHaveBeenCalled()
    window.angular.bootstrap = 'hamid'
    expect(window.angular.bootstrap).toBe('hamid')

    var bootstrapCalled = false
    window.angular.bootstrap = function () {
      bootstrapCalled = true
      window.angular.resumeBootstrap = function () {}
    }

    window.angular.bootstrap()
    window.angular.resumeBootstrap()
    expect(window.angular.resumeDeferredBootstrap).toBe(undefined)
    expect(opbeatBootstrap).toHaveBeenCalled()
    expect(bootstrapCalled).toBe(true)
  })

  it('should patch resumeBootstrap if bootstrap is not called directly ', function () {
    window.name = DEFER_LABEL + window.name
    window.angular = {}
    patchAngularBootstrap(opbeatBootstrap)

    expect(opbeatBootstrap).not.toHaveBeenCalled()
    var resumeBootstrapCalled = false

    window.angular.resumeBootstrap = function () {
      resumeBootstrapCalled = true
    }

    window.angular.resumeBootstrap()
    expect(window.angular.resumeDeferredBootstrap).toBe(undefined)
    expect(opbeatBootstrap).toHaveBeenCalled()
    expect(resumeBootstrapCalled).toBe(true)
  })

  it('should set resumeDeferredBootstrap if bootstrap is not deferred', function () {
    window.angular = {}
    patchAngularBootstrap(opbeatBootstrap)

    expect(opbeatBootstrap).not.toHaveBeenCalled()
    var resumeBootstrapCalled = false

    window.angular.resumeBootstrap = function () {
      resumeBootstrapCalled = true
    }

    expect(typeof window.angular.resumeDeferredBootstrap).toBe('function')
    window.angular.resumeDeferredBootstrap()
    expect(opbeatBootstrap).toHaveBeenCalled()
    expect(resumeBootstrapCalled).toBe(true)
  })

  it('should set resumeDeferredBootstrap if bootstrap is not deferred and bootstrap is called directly', function () {
    window.angular = {}
    patchAngularBootstrap(opbeatBootstrap)

    expect(opbeatBootstrap).not.toHaveBeenCalled()
    var resumeBootstrapCalled = false

    var bootstrapCalled = false
    window.angular.bootstrap = function () {
      bootstrapCalled = true
      window.angular.resumeBootstrap = function () {
        resumeBootstrapCalled = true
      }
    }

    expect(typeof window.angular.resumeDeferredBootstrap).toBe('function')

    window.angular.bootstrap()
    window.angular.resumeDeferredBootstrap()

    expect(opbeatBootstrap).toHaveBeenCalled()
    expect(resumeBootstrapCalled).toBe(true)
    expect(bootstrapCalled).toBe(true)
  })

  afterEach(function () {
    // Clean up side effects
    delete window.angular
    window.angular = originalAngular
    window.name = ''
  })
})
