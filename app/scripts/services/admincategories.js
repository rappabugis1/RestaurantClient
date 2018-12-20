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
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/addCategory', payload)
          .then(function onSuccess(response) {
            callback(response);
          })
          .catch(function onError(error) {
              callback(error);
          })
      },

      editCategory: function (payload, callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/editCategory', payload)
          .then(function onSuccess(response) {
            callback(response);
          })
          .catch(function onError(error) {
            if(error.status===400)
              callback(error);
          })
      },

      getCategoryDetails: function (payload, callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/getCategoryDetails', payload)
          .then(function onSuccess(response) {
            callback(response);
          })
          .catch(function onError(error) {
            if(error.status===400)
              callback(error);
          })
      },
      getAllCategories: function (callback) {
        $http.get('https://ridvansrestaurantserver.herokuapp.com/app/getAllCategories')
          .then(function onSuccess(response) {
            callback(response);
          })
          .catch(function onError(error) {
            if(error.status===400)
              callback(error);
          })
      },

      deleteCategory : function (payload,callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/deleteCategory', payload).then(function (response) {
          callback(response);
        });
      }

      //TODO delete
    };
  });
