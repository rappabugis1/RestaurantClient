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

      SessionStorageService.save("reservationInformation",JSON.stringify(reservationInformation));
      SessionStorageService.save("reservationStartTime", new Date());
      $location.path('/reservation');
    };

    $scope.numberPeople = [1,2,3,4,5,6,7,8,9,10];
  })

  .controller('ReservationController', function ($scope,ShareDataService, $timeout, $templateCache, $window, $localStorage, SessionStorageService, $log) {

    $scope.information=JSON.parse(SessionStorageService.get("reservationInformation"));
    $scope.startTime= new Date(SessionStorageService.get("reservationStartTime"));

    $log.info(new Date());
    $log.info($scope.startTime);
    $scope.counter =180-(Math.floor(Math.abs(new Date()- $scope.startTime)/1000));

    $scope.onTimeout = function(){
      $scope.counter--;
      if($scope.counter===0){
        $window.alert("Time expired");
        $window.history.back();
      }
      seconds = $timeout($scope.onTimeout,1000);
    };
    var seconds = $timeout($scope.onTimeout,1000);

    if($localStorage.currentUser){
      $scope.currentUser =$localStorage.currentUser.currentUser.data.id;
    }

  })

  .controller('SubmitReservationController', function ($scope, $http, AuthenticationService, $log, ReservationService, ShareDataService) {
    $scope.information=ShareDataService.getData();

    $http.get("jsonexp/locations.json").then(
      function (response) {
        $scope.locations = response.data;
      }
    );




    $scope.reservationSubmit = function (){
      var reservationPayload = {
        persons:  $scope.information.people,
        reservationDate: $scope.information.date.toLocaleDateString("en-GB"),
        reservationHour: $scope.information.time.getHours()+":"+ $scope.information.time.getMinutes(),
        idRestaurant: $scope.information.restaurantId,
        request : $scope.request
      };

      ReservationService.addReservation(reservationPayload);
    };

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
              $scope.reservationSubmit();
            }
            else {
              $scope.error = 'Email is already in use!';
            }
          }
        );
      }
    };

  });
