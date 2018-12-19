'use strict';

/**
 * @ngdoc service
 * @name clientApp.admin
 * @description
 * # admin
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('AdminCommonService', function ($http) {

    return {
      getAdministrationCounters: function (callback) {
        $http.get('/app/admin/getAdministrationCounters')
          .then(function onSuccess(response) {
            callback(response.data);
          })
          .catch(function onError(error) {
            if(error.status===400)
              return error.data;
          })
      }
    };
  });
