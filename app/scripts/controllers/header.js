'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('NavigationController', function ($scope, $location, $localStorage, AuthenticationService) {

    $scope.isLoged = function(){
      return  $localStorage.currentUser;
    };

    $scope.isOpen = false;

    $scope.isAdmin = function () {
      var token = $localStorage.currentUser.token;
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      var json= JSON.parse(atob(base64));

      return json.user_type.toString()==="admin";
    };

    $scope.Logout = function(){
      AuthenticationService.Logout();
      $location.path('/');
    };

    $scope.isActive = function (activeView) {
      return activeView === $location.path();
    };
  });
