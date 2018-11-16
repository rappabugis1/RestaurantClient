'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RegisterController', function ($scope, $http, $location, AuthenticationService) {


    $http.get("jsonexp/locations.json").then(
      function (response) {
        $scope.locations = response.data;
      }
    );

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


        AuthenticationService.Register(payload, function (result) {
            if (result) {
              $location.path('/login');
            }
            else {

              $scope.error = 'Selected e-mail is already in use!';
            }
          }
        );
      }
    };

  });
