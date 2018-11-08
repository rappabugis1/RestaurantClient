'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ReservationCtrl
 * @description
 * # ReservationCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ReservationBarController', function ($scope, $log, SessionStorageService, ShareDataService, $location) {
    $scope.dateToday= new Date();

    $scope.maxDate = new Date().setMonth($scope.dateToday.getMonth()+4);
    $scope.minDate=new Date();
    $scope.selectedDate =new Date();

    if ($scope.selectedDate.getDate() === $scope.dateToday.getDate() && new Date() <= new Date().setHours(21,0,0) && new Date() >= new Date().setHours(9,0,0)) {
      $scope.minTime = new Date().setHours(new Date().getHours() + 1, 0, 0);
    } else {
      $scope.minTime = new Date().setHours(9, 0, 0);
      $scope.minDate.setDate($scope.dateToday.getDate() + 1);
      $scope.selectedDate.setDate($scope.dateToday.getDate() + 1);
    }

    $scope.$watch('selectedDate', function(){
      if($scope.selectedDate!==undefined) {
        if ($scope.selectedDate.getDate() === $scope.dateToday.getDate() && new Date() <= new Date().setHours(21,0,0) && new Date() >= new Date().setHours(9,0,0) ) {
          $scope.minTime = new Date().setHours(new Date().getHours() + 1, 0, 0);
        } else {
          $scope.minTime = new Date().setHours(9, 0, 0);
          $scope.minDate.setDate($scope.dateToday.getDate() + 1);
        }
      }
    });

    $scope.proceedReservation = function (){
      var reservationInformation = {
        people : $scope.selectedNumber,
        date : $scope.selectedDate,
        time : $scope.selectedTime,
        restaurantId : JSON.parse(SessionStorageService.get("restaurantId")).id
      };

      ShareDataService.addData(reservationInformation);
      $location.path('/reservation');

    };

    $scope.numberPeople = [1,2,3,4,5,6,7,8,9,10];
  })

  .controller('ReservationController', function ($scope,ShareDataService, $log, $timeout) {
    $scope.information=ShareDataService.getData();

    $scope.counter = 180;
    $scope.onTimeout = function(){
      $scope.counter--;
      seconds = $timeout($scope.onTimeout,1000);
    };
    var seconds = $timeout($scope.onTimeout,1000);


  });
