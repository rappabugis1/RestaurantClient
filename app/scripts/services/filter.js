'use strict';

/**
 * @ngdoc service
 * @name clientApp.filter
 * @description
 * # filter
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('FilterFactoryServis', function ($http) {

    return {
      getFilterResult: function (payload, callback) {
        $http.post('/app/getRestaurantsByFilter', payload)
      .then(function onSucces(response) {

          //If succesfull return data
          callback(response.data);
        })
          .catch(function onError(error) {
            if(error.status===400){
              callback(error.data);
            }
          });
      },

      getAllCategories:function (callback) {
        $http.get('/app/getAllCategories')
          .then(function onSucces(response) {

            //If succesfull return data
            callback(response.data);
          })
          .catch(function onError(error) {
            if(error.status===400){
              callback(error.data);
            }
          });
      },

      getAdminFilter: function (filterType, payload, callback) {
        $http.post('/app/admin/getFiltered'+filterType , payload)
          .then(function onSuccess(response) {
            callback(response);
          })
          .catch(function onError(error) {
            if(error.status===400){
              callback(error);
            }
          })
      }

    };
  });
