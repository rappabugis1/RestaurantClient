'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('HeaderCtrl', function ($scope, $location, $localStorage, AuthenticationService) {

    $scope.isLoged = function(){
      return  $localStorage.currentUser;
    };

    $scope.Logout = function(){
      AuthenticationService.Logout();
    };

    $scope.isActive = function (activeView) {
      return activeView === $location.path();
    };
  });
