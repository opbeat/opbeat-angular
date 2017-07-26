<a name="3.15.0"></a>
# [3.15.0](https://github.com/opbeat/opbeat-angular/compare/v3.14.0...v3.15.0) (2017-07-26)


### Bug Fixes

* angularInitializer should only patch angular if platform is supported ([6c66751](https://github.com/opbeat/opbeat-angular/commit/6c66751))
* explicitly set hard navigation on the first transaction ([6e6ecd4](https://github.com/opbeat/opbeat-angular/commit/6e6ecd4))
* **bootstrapPatch:** fix registering ngOpbeat if opbeat is loaded first ([de881e9](https://github.com/opbeat/opbeat-angular/commit/de881e9))


### Features

* **ngOpbeat:** add support for ui router transitions ([a9951a2](https://github.com/opbeat/opbeat-angular/commit/a9951a2))
* use opbeat-js-core 0.1.0 ([de66a8d](https://github.com/opbeat/opbeat-angular/commit/de66a8d))



<a name="3.14.0"></a>
# [3.14.0](https://github.com/opbeat/opbeat-angular/compare/v3.13.0...v3.14.0) (2017-02-22)


### Features

* publish setInitialPageLoadName api ([7de96f3](https://github.com/opbeat/opbeat-angular/commit/7de96f3))



<a name="3.13.0"></a>
# [3.13.0](https://github.com/opbeat/opbeat-angular/compare/3.12.0...v3.13.0) (2017-02-13)



<a name="3.12.0"></a>
# [3.12.0](https://github.com/opbeat/opbeat-angular/compare/v3.11.0...3.12.0) (2017-01-30)


### Bug Fixes

* **ngOpbeat:** consider isPlatformsupported before setting appBootstrap metrics ([a5a74e8](https://github.com/opbeat/opbeat-angular/commit/a5a74e8))



<a name="3.11.0"></a>
# [3.11.0](https://github.com/opbeat/opbeat-angular/compare/v3.10.0...v3.11.0) (2017-01-24)


### Features

* add appBeforeBootstrap and appAfterBootstrap to metrics ([2c5f175](https://github.com/opbeat/opbeat-angular/commit/2c5f175))



<a name="3.10.0"></a>
# [3.10.0](https://github.com/opbeat/opbeat-angular/compare/v3.9.1...v3.10.0) (2017-01-18)



<a name="3.9.1"></a>
## [3.9.1](https://github.com/opbeat/opbeat-angular/compare/v3.9.0...v3.9.1) (2017-01-13)



<a name="3.9.0"></a>
# [3.9.0](https://github.com/opbeat/opbeat-angular/compare/v3.8.3...v3.9.0) (2017-01-13)


### Features

* sendPageLoadMetrics if there're no route changes ([01a6dde](https://github.com/opbeat/opbeat-angular/commit/01a6dde))



<a name="3.8.3"></a>
## [3.8.3](https://github.com/opbeat/opbeat-angular/compare/v3.8.2...v3.8.3) (2017-01-10)



<a name="3.8.2"></a>
## [3.8.2](https://github.com/opbeat/opbeat-angular/compare/v3.8.1...v3.8.2) (2017-01-10)



<a name="3.8.1"></a>
## [3.8.1](https://github.com/opbeat/opbeat-angular/compare/v3.8.0...v3.8.1) (2017-01-06)



<a name="3.8.0"></a>
# [3.8.0](https://github.com/opbeat/opbeat-angular/compare/v3.7.0...v3.8.0) (2016-12-29)



<a name="3.7.0"></a>
# [3.7.0](https://github.com/opbeat/opbeat-angular/compare/v3.6.1...v3.7.0) (2016-12-20)


### Features

* send angular:bootstrap as source to runInOpbeatZone ([5027b78](https://github.com/opbeat/opbeat-angular/commit/5027b78))



<a name="3.6.1"></a>
## [3.6.1](https://github.com/opbeat/opbeat-angular/compare/v3.6.0...v3.6.1) (2016-11-17)


### Bug Fixes

* **bootstrapPatch:** return orignalResumeBootstrap if not a function ([0ac9a2b](https://github.com/opbeat/opbeat-angular/commit/0ac9a2b))



<a name="3.6.0"></a>
# [3.6.0](https://github.com/opbeat/opbeat-angular/compare/v3.5.0...v3.6.0) (2016-11-16)



<a name="3.5.0"></a>
# [3.5.0](https://github.com/opbeat/opbeat-angular/compare/v3.4.0...v3.5.0) (2016-11-09)


### Bug Fixes

* **ngOpbeat:** consider redirects for ngRoute ([db13fda](https://github.com/opbeat/opbeat-angular/commit/db13fda))


### Features

* **ExceptionHandler:** install global onerror ([cd4d19c](https://github.com/opbeat/opbeat-angular/commit/cd4d19c))



<a name="3.4.0"></a>
# [3.4.0](https://github.com/opbeat/opbeat-angular/compare/v3.1.4...v3.4.0) (2016-11-02)


### Bug Fixes

* **angularInitializer:** try to register opbeat during initialization if possible ([7a155b3](https://github.com/opbeat/opbeat-angular/commit/7a155b3)), closes [#69](https://github.com/opbeat/opbeat-angular/issues/69)
* **Config:** consider empty objects ([e00dfed](https://github.com/opbeat/opbeat-angular/commit/e00dfed))
* **frames:** consider empty userContext ([f98f368](https://github.com/opbeat/opbeat-angular/commit/f98f368))
* **opbeat-angular:** initialize only if we support the platform ([4bb85a2](https://github.com/opbeat/opbeat-angular/commit/4bb85a2))
* **OpbeatBackend:** send headers to transport ([6c4b632](https://github.com/opbeat/opbeat-angular/commit/6c4b632))
* **ZoneService:** remove requestAnimationFrame task ([abc924d](https://github.com/opbeat/opbeat-angular/commit/abc924d))
* **ZoneService:** use XHR DONE constant on the target ([dfe9699](https://github.com/opbeat/opbeat-angular/commit/dfe9699))
* **ZoneServiceMock:** return value from run functions ([25639f9](https://github.com/opbeat/opbeat-angular/commit/25639f9))


### Features

* **interactions:** capture ngClick and ngSubmit interactions ([311b0cd](https://github.com/opbeat/opbeat-angular/commit/311b0cd))
* **ngOpbeat:** add angular version and platform to config ([a0a79b9](https://github.com/opbeat/opbeat-angular/commit/a0a79b9))
* **opbeat-angular:** check for global serviceFactory ([041537a](https://github.com/opbeat/opbeat-angular/commit/041537a))
* **opbeat-angular:** load opbeat-angular before or after angular ([d1a9698](https://github.com/opbeat/opbeat-angular/commit/d1a9698))
* **OpbeatBackend:** send contextInfo ([00e999f](https://github.com/opbeat/opbeat-angular/commit/00e999f))
* **Transaction:** add contextInfo ([75c3cdb](https://github.com/opbeat/opbeat-angular/commit/75c3cdb))



<a name="3.1.4"></a>
## [3.1.4](https://github.com/opbeat/opbeat-angular/compare/v3.1.3...v3.1.4) (2016-08-09)



<a name="3.1.3"></a>
## [3.1.3](https://github.com/opbeat/opbeat-angular/compare/v3.1.2...v3.1.3) (2016-08-02)



<a name="3.1.2"></a>
## [3.1.2](https://github.com/opbeat/opbeat-angular/compare/v3.1.1...v3.1.2) (2016-07-25)



<a name="3.1.1"></a>
## [3.1.1](https://github.com/opbeat/opbeat-angular/compare/v3.1.0...v3.1.1) (2016-07-13)



<a name="3.1.0"></a>
# [3.1.0](https://github.com/opbeat/opbeat-angular/compare/v3.0.1...v3.1.0) (2016-07-11)



<a name="3.0.1"></a>
## [3.0.1](https://github.com/opbeat/opbeat-angular/compare/v3.0.0...v3.0.1) (2016-06-17)



<a name="3.0.0"></a>
# [3.0.0](https://github.com/opbeat/opbeat-angular/compare/v2.1.8...v3.0.0) (2016-05-31)
