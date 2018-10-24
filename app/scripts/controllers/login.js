'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('LoginCtrl', function ($scope, $http, $log) {
    $scope.loginSubmit = function(isValid) {

      if(isValid){
        var payload = {
          email : $scope.email,
          password : $scope.password
        };

        $http.post('app/login', payload)
          .then(function onSuccess(response) {
            $log.debug(response.data);
          })
          .catch(function onError(response){

          });
      }


    };
  });
