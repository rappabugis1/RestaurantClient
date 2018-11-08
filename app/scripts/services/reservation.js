'use strict';

/**
 * @ngdoc service
 * @name clientApp.reservation
 * @description
 * # reservation
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('ReservationService', function ($http) {
    return {
      addReservation: function (payload) {
        $http.post('app/addReservation', payload);
      }
    };
  });
