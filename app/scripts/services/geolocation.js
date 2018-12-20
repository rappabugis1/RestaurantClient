'use strict';

/**
 * @ngdoc service
 * @name clientApp.geolocation
 * @description
 * # geolocation
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('GeometryService', function ($http, $q, $window) {

    function getCurrentPosition() {
      var deferred = $q.defer();

      if (!$window.navigator.geolocation) {
        deferred.reject('Geolocation not supported.');
      } else {
        $window.navigator.geolocation.getCurrentPosition(
          function (position) {
            deferred.resolve(position);
          },
          function (err) {
            deferred.reject(err);
          });
      }

      return deferred.promise;
    }

    return {

      getNumberForHome: function (callback) {

        getCurrentPosition().then(function (response) {
          $http.post('/app/getCloseRestNumber', {longitude: response.coords.longitude, latitude: response.coords.latitude, radius: 15000})
            .then(function (response) {
              callback(response);
            });
        })
          .catch(function () {
            callback(-1);
          });
      },

      getCurrentPos : getCurrentPosition

    };
  });
