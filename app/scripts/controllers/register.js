'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RegisterController', function ($scope, $http, $location, AuthenticationService, AdminLocationService) {

    AdminLocationService.getLocationsForSelect(function (response) {
      if(response.status!==400){
        $scope.locations = response.data;

      }
    });

    $scope.$watchGroup(['email'] ,function () {
      $scope.error=null;
    });

    $scope.registerSubmit = function (isValid) {

      if (isValid) {
        var payload = {
          email: $scope.email,
          firstName: $scope.firstName,
          lastName: $scope.lastName,
          phone: $scope.phone,
          country: $scope.country.country_name,
          city: $scope.city,
          password: $scope.password
        };

        $scope.confirmPassword = null;
        $scope.password = null;
        $scope.loading=true;

        AuthenticationService.Register(payload, function (result) {
          $scope.loading=false;

          if (result.status!==400) {
            $scope.registerForm.$setPristine(true);
            $location.path('/login');
            }
            else {
              $scope.error = result.data;
            }
          }
        );
      }
    };

  });
