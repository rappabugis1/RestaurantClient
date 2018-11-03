'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('LoginCtrl', function ($log,$scope,$location, AuthenticationService) {


    function initController(){
      AuthenticationService.Logout();
    }

    initController();
    $scope.loginSubmit = function(isValid) {

      if(isValid){
        var payload = {
          email : $scope.email,
          password : $scope.password
        };


        AuthenticationService.Login(payload.email, payload.password, function (result){
          if(result===true) {
            $location.path('/');
          }
          else {

            $scope.error = 'Username or password is incorrect';
          }
        }

        );

      }
    };
  });
