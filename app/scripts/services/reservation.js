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
      checkReservationAvailability : function (payload, callback) {
        $http.post('/app/checkReservationAvailability', payload)
          .then(function onSuccess(response) {

            //If succesfull return data
            callback(response.data);
          })
          .catch(function onError(error) {
            if(error.status===400) {
              callback(error.data);
            }
          });
      },

      makeTemporaryReservation : function (payload, callback) {
        $http.post('/app/makeReservation', payload)
          .then(function onSuccess(response) {

            //If succesfull return data
            callback(response.data);
          })
          .catch(function onError(error) {
            if (error.status === 400) {
              callback(error.data);
            }
          });
      },

      deleteTemporaryReservation : function (payload, callback) {
        $http.post('/app/deleteReservation', {idReservation: payload})
          .then(function onSuccess(response) {

            //If succesfull return data
            callback(response);
          })
          .catch(function onError(error) {
            if(error.status===400) {
              callback(error.data);
            }
          });
      },

      updateToFixed : function (payload, callback) {
        $http.post('/app/setReservationToFixed', payload)
          .then(function onSuccess(response) {

            //If succesfull return data
            callback(response);
          })
          .catch(function onError(error) {
            if(error.status===400) {
              callback(error.data);
            }
          });
      },

      getUserReservations : function (callback) {
        $http.get('/app/getListOfReservationsForUser')
          .then(function onSuccess(response) {
            callback(response);
          })
          .catch(function onError(error) {
            if(error.status===400) {
              callback(error.data);
            }
          });
      }
    };
  });
