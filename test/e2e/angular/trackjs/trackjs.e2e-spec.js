var utils = require('opbeat-test/webdriverio-utils')
describe('opbeat-angular trackjs', function () {
  beforeEach(utils.verifyNoBrowserErrors)

  it('should have a title', function () {
    return browser.url('http://localhost:8000/angular/trackjs/index.html')
      .then(function () {
        browser.getTitle()
          .then(function (title, err) {
            expect(err).toBeFalsy()
            expect(title).toEqual('opbeat-angular')
          })
      })
  })

  afterEach(utils.allowSomeBrowserErrors.bind(this, ['app test error', 'trackjs_test']))
})
