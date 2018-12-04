'use strict';

/**
 * @ngdoc service
 * @name clientApp.admincategories
 * @description
 * # admincategories
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('AdminCategoryService', function ($http) {

    return {
      addCategory: function (payload, callback) {
        $http.post('/app/admin/addCategory', payload)
          .then(function onSuccess(response) {
            callback(response);
          })
          .catch(function onError(error) {
              callback(error);
          })
      },

      editCategory: function (payload, callback) {
        $http.post('/app/admin/editCategory', payload)
          .then(function onSuccess(response) {
            callback(response);
          })
          .catch(function onError(error) {
            if(error.status===400)
              callback(error);
          })
      },

      getCategoryDetails: function (payload, callback) {
        $http.post('/app/admin/getCategoryDetails', payload)
          .then(function onSuccess(response) {
            callback(response);
          })
          .catch(function onError(error) {
            if(error.status===400)
              callback(error);
          })
      }

      //TODO delete
    };
  });
