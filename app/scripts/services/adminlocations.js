'use strict';

/**
 * @ngdoc service
 * @name clientApp.adminlocations
 * @description
 * # adminlocations
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('AdminLocationService', function ($http) {

    return {
      addLocation: function (payload, callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/addLocation', payload)
          .then(function onSuccess(response) {
            callback(response.data);
          })
          .catch(function onError(error) {
            if(error.status===400)
              callback(error);
          })
      },

      editLocation: function (payload, callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/editLocation', payload)
          .then(function onSuccess(response) {
            callback(response.data);
          })
          .catch(function onError(error) {
            if(error.status===400)
              callback(error);
          })
      },

      getLocationDetails: function (payload, callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/getLocationDetails', payload)
          .then(function onSuccess(response) {
            callback(response.data);
          })
          .catch(function onError(error) {
            if(error.status===400)
              callback(error);
          })
      },

      getLocationsForSelect : function (callback) {
        $http.get('https://ridvansrestaurantserver.herokuapp.com/app/getLocationsForSelect')
          .then(function onSuccess(response) {
            callback(response);
          })
          .catch(function onError(error) {
            if(error.status===400)
              callback(error);
          })
      },

      deleteLocation : function (payload, callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/deleteLocation', payload).then(function (response) {
          callback(response);
        });
      }


    };
  });
