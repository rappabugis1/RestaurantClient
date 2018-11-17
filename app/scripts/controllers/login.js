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

    $window.scrollTo(0,0);
    function initController() {
      AuthenticationService.Logout();
    }

    $scope.$watchGroup(['email','password'] ,function () {
      $scope.error=null;
    });
    initController();
    $scope.loginSubmit = function (isValid) {

      if (isValid) {
        var payload = {
          email: $scope.email,
          password: $scope.password
        };

        $scope.loading=true;

        AuthenticationService.Login(payload.email, payload.password, function (result) {
          $scope.loading=false;

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
