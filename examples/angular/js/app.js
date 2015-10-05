/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngOpbeat'])
  .config(function ($routeProvider) {
    'use strict'
    var routeConfig = {
      controller: 'TodoCtrl',
      templateUrl: 'todomvc-index.html',
      resolve: {
        store: function (todoStorage) {
          // Get the correct module (API or localStorage).
          return todoStorage.then(function (module) {
            module.get(); // Fetch the todo records in the background.
            return module
          })
        }
      }
    }

    $routeProvider
      .when('/', routeConfig)
      .when('/:status', routeConfig)
      .otherwise({
        redirectTo: '/'
      })
  })
  .config(function ($opbeatProvider) {
    $opbeatProvider.config({
      debug: true,
      orgId: 'b3eba3d11f6e4c3a9db52f477caa4fa2',
      appId: 'e9797db8c7',
      token: '6451721d51b6d95cf6c6b09498feafd865f1f976'
    })

    $opbeatProvider.install()
  })
