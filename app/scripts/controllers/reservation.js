'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ReservationCtrl
 * @description
 * # ReservationCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ReservationCtrl', function ($scope) {
    $scope.dateToday= new Date();
    $scope.dateMax = new Date().setMonth($scope.dateToday.getMonth()+4);
    $scope.selectedDate =$scope.dateToday;


    $scope.$watch('selectedDate', function(){
      if($scope.selectedDate.getDate() === $scope.dateToday.getDate()){
        $scope.minTime=new Date().setHours($scope.selectedDate.getHours()+1,0,0);
      } else {
        $scope.minTime=new Date().setHours(9,0,0);
      }
    });

  });
