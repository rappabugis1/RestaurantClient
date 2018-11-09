'use strict';

/**
 * @ngdoc service
 * @name clientApp.sessionstorage
 * @description
 * # sessionstorage
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('SessionStorageService', function ($window) {

    return {
      get: function(key) {
        return $window.sessionStorage.getItem(key);
      },
      save: function(key, data) {
        $window.sessionStorage.setItem(key, data);
      },
      delete: function (key) {
        $window.sessionStorage.removeItem(key);
      }
    };
  });
