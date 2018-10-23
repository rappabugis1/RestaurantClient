'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope){

      $scope.tables = {};

      $scope.tables = {
        people1: "1",
        people2: "2",
        people3: "3",
        people4: "4"}

  });
