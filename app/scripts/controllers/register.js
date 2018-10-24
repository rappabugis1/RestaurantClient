'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RegisterCtrl', function ($scope, $http, $log) {
    $scope.loginSubmit = function(isValid) {

      if(isValid){
        var payload = {

          email : $scope.email,
          firstName : $scope.firstName,
          lastName: $scope.lastName,
          phone : $scope.phone,
          country : $scope.country,
          city : $scope.city,
          passwordReg : $scope.passwordReg
        };

        $scope.confirmPassword=null;

        $http.post('app/login', payload)
          .then(function onSuccess(response) {
            $log.debug(response.data);
          })
          .catch(function onError(response){

          });
      }
    };

  });
