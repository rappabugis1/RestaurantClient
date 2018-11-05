'use strict';

/**
 * @ngdoc service
 * @name clientApp.Menu
 * @description
 * # Menu
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('Menu', function ($http, $log) {

    return {
      getDinner: function () {

        return $http.get('jsonexp/samplemenu.json');

      }
    };
  });
