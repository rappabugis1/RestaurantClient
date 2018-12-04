'use strict';

/**
 * @ngdoc service
 * @name clientApp.adminusers
 * @description
 * # adminusers
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('AdminUserService', function ($http) {

    return {
      editUser: function (payload, callback) {
        $http.post('/app/admin/editUser', payload)
          .then(function onSuccess(response) {
            callback(response.data);
          })
          .catch(function onError(error) {
            if(error.status===400)
              callback(error);
          })
      }
    };
  });
