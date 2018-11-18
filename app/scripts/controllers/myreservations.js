'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MyreservationsCtrl
 * @description
 * # MyreservationsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MyReservationsController', function (ReservationService, $scope, $window) {

    $scope.noReservationsActive=false;
    $scope.noReservationsPast=false;
    $scope.reservation = null;

    $scope.loading=true;
    ReservationService.getUserReservations(function (response) {
      $scope.userReservations = response.data;
      $scope.loading=false;

      if($scope.userReservations.activeReservations.length===0){
        $scope.noReservationsActive=true;
      }
      if($scope.userReservations.pastReservations.length===0){
        $scope.noReservationsPast=true;
      }

    });

    $scope.pick = function (reservation) {
      $scope.reservation= reservation;
      $window.scrollTo(0, 0);

    };

  });
