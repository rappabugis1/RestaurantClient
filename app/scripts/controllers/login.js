'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('LoginController', function ($log, $scope, $location, AuthenticationService, SessionStorageService, $window) {


    function initController() {
      AuthenticationService.Logout();
    }

    initController();
    $scope.loginSubmit = function (isValid) {

      if (isValid) {
        var payload = {
          email: $scope.email,
          password: $scope.password
        };


        AuthenticationService.Login(payload.email, payload.password, function (result) {
            if (result === true) {
              //If there is a goBack value, after login the window is restored to previous one
              if(SessionStorageService.get("goBack")){
                SessionStorageService.delete("goBack");
                SessionStorageService.save("reservationStartTime", new Date());
                $window.history.back();
              }
              else{
                $location.path('/');
              }
            }
            else {

              $scope.error = 'Username or password is incorrect';
            }
          }
        );

      }
    };
  });
