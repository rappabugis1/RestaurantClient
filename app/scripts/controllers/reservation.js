'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ReservationCtrl
 * @description
 * # ReservationCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')

//Reservation Bar controller
  .controller('ReservationBarController', function ($scope,SessionStorageService, ShareDataService, $location, ReservationService) {
    //Getting todays date and initializing variables for dates
    $scope.dateToday= new Date();
    $scope.maxDate = new Date().setMonth($scope.dateToday.getMonth()+4);
    $scope.minDate=new Date();
    $scope.selectedDate =new Date();

    //If selected date is today and its <22 oclock, minimum hours for reservation time is current time + 1
    if ($scope.selectedDate.getDate() === $scope.dateToday.getDate() && new Date() <= new Date().setHours(21,0,0) && new Date() >= new Date().setHours(9,0,0)) {
      $scope.minTime = new Date().setHours(new Date().getHours() + 1, 0, 0);
    } else {

      //If its today and its >22 oclock, then minimum day is tomorrow and minimum time is 9
      $scope.minTime = new Date().setHours(9, 0, 0);
      $scope.minDate.setDate($scope.dateToday.getDate() + 1);
      $scope.selectedDate.setDate($scope.dateToday.getDate() + 1);
    }

    //Watches change in selected date, if its today, hour that can be chosen is restricted to from current time to 22 oclock
    $scope.$watch('selectedDate', function(){
      $scope.AvailabilityErrorColapsed=true;
      $scope.AvailabilityInfoColapsed=true;

      if($scope.selectedDate!==undefined) {
        if ($scope.selectedDate.getDate() === $scope.dateToday.getDate() && new Date() <= new Date().setHours(21,0,0) && new Date() >= new Date().setHours(9,0,0) ) {
          $scope.minTime = new Date().setHours(new Date().getHours() + 1, 0, 0);
        } else {
          $scope.minTime = new Date().setHours(9, 0, 0);
          $scope.minDate.setDate($scope.dateToday.getDate() + 1);
        }
      }
    });

    //Collapses the info/error collapse if there was any open on values change

    $scope.$watchGroup(['selectedNumber','selectedTime', 'selectedLength'] ,function () {
      $scope.AvailabilityErrorColapsed=true;
      $scope.AvailabilityInfoColapsed=true;
    });

    //Initialise collapses to collapsed
    $scope.AvailabilityErrorColapsed=true;
    $scope.AvailabilityInfoColapsed=true;

    //Find reservation button
    $scope.checkReservation = function (){

      //Put payload info
      $scope.reservationCheckPayload = {
        persons: Number($scope.selectedNumber.toString().substring(0,1)),
        reservationDate: $scope.selectedDate.toLocaleDateString("en-GB"),
        reservationHour: $scope.selectedTime.getHours()+":"+ $scope.selectedTime.getMinutes(),
        idRestaurant: JSON.parse(SessionStorageService.get("restaurantId")).id,
        lengthOfStay : Number($scope.selectedLength.toString().substring(0,3))
      };

      ReservationService.checkReservationAvailability($scope.reservationCheckPayload, function(result){
        if(result.tablesLeft){

          //Get data from result
          $scope.tablesLeft = result.tablesLeft;
          $scope.bestTimes = result.bestTime;

          //Show reservation availability information
          $scope.AvailabilityInfoColapsed=false;

        }
        else {
          //If there is response error
          if(result){
            $scope.AvailabilityErrorColapsed=false;
            $scope.error=result;
          }else{
            $scope.error="Something went wrong."
          }
        }

      });

      //Method after the checkReservation returns time values, button click on the time value runs this method
      $scope.proceedReservation = function(time){

        $scope.reservationCheckPayload.reservationHour=time;
        $scope.reservationCheckPayload.active = true;
        //Save payload api
        SessionStorageService.save("payloadApi", JSON.stringify($scope.reservationCheckPayload));

        //Change time to selected time, date to selected date, and number to selected number, because the parsed values are different
        $scope.reservationCheckPayload.reservationDate=$scope.selectedDate;
        $scope.reservationCheckPayload.persons=$scope.selectedNumber;

        //Save to session storage
        SessionStorageService.save("reservationInformation",JSON.stringify($scope.reservationCheckPayload));
        SessionStorageService.save("reservationStartTime", new Date());


        $location.path('/reservation');
      }
    };

    $scope.numberPeople = ["1 Person", "2 People","3 People","4 People","5 People","6 People","7 People","8 People"];
    $scope.numberMinutes=["15 minutes","30 minutes","45 minutes","60 minutes","90 minutes","120 minutes"];

    $scope.searchHome = "";


    $scope.homeSearch = function () {

      $scope.reservationCheckPayload = {
        persons: Number($scope.selectedNumber.toString().substring(0,1)),
        reservationDate: $scope.selectedDate.toLocaleDateString("en-GB"),
        reservationHour: $scope.selectedTime.getHours()+":"+ $scope.selectedTime.getMinutes(),
        lengthOfStay : Number($scope.selectedLength.toString().substring(0,3))
      };

      $scope.filterPayload = {
        searchText: $scope.searchHome,
        reservationInfo: $scope.reservationCheckPayload
      };
      SessionStorageService.save("homeSearch", JSON.stringify($scope.filterPayload));
      $location.path('/restaurants');
    }
  })

//Reservation page controller
  .controller('ReservationController', function ($scope,ShareDataService, $timeout, $templateCache, $window, $localStorage,$log, SessionStorageService, $location,RestaurantService, ReservationService) {

    //If there is no current session in sessionStorage, redirects to home page. exp If user manually enters /reservation
    if(!SessionStorageService.get("reservationInformation"))
      $location.path('/');

    //Gets reservation information from sesssionStorage
    $scope.information=JSON.parse(SessionStorageService.get("reservationInformation"));

    RestaurantService.getRestaurantDetails(JSON.parse(SessionStorageService.get("restaurantId")).id).then(function(response) {
       $scope.restaurantNameImage = response.data;
    });

    $scope.$on('$routeChangeStart', function(event, next, current) {
      if($scope.information.active) {
        if (!$window.confirm("The reservation is not completed! Leave?")) {
          event.preventDefault();

        } else {
          ReservationService.deleteTemporaryReservation(JSON.parse(SessionStorageService.get("tempReservationId")));

          finishSession();

          $timeout.cancel($scope.seconds);
        }
      }

    });

    $scope.userLogged=false;
    //Start countdown if logged in
    if($localStorage.currentUser){
      $scope.currentUser =$localStorage.currentUser.currentUser.data.id;
      $scope.userLogged=true;

      if(JSON.parse(SessionStorageService.get("reservationInformation")).active && !SessionStorageService.get("tempReservationId")){
        //Make a temporary reservation to secure it from being taken by other users
        ReservationService.makeTemporaryReservation(JSON.parse(SessionStorageService.get("payloadApi")), function (response) {

          //If the reservation of temp has succeeded save its data, else show alert and go back
          if(response.id){
            SessionStorageService.save("tempReservationId", response.id);
          }
          else{
            $window.alert("The reservation has just been booked!");

            finishSession();

            $timeout.cancel($scope.seconds);
          }
        });
      }




      //Get reservation start time
      $scope.startTime= new Date(SessionStorageService.get("reservationStartTime"));
      //Calculates remaining time based of the time when the reservation session started
      $scope.counter =180-(Math.floor(Math.abs(new Date()- $scope.startTime)/1000));

      if(!$scope.information.active)
        $scope.counter=0;


      $scope.request="";

      //Creates payload and submits reservation delete temp information and go back
      $scope.reservationSubmit = function (){

        $timeout.cancel($scope.seconds);

        $scope.loading=true;

        var fixedPayload = {
          idReservation : JSON.parse(SessionStorageService.get("tempReservationId")),
          request : this.request
        };

        $timeout(function() {

            ReservationService.updateToFixed(fixedPayload, function (response) {
              $scope.loading= false;
            });

            finishSession();

            $window.history.back(); }
          , 2000);
      };

      //Simulates second countdown
      $scope.onTimeout = function(){
        $scope.counter--;

        //If time expires, clear session information and go back
        if($scope.counter===0){

          ReservationService.deleteTemporaryReservation(JSON.parse(SessionStorageService.get("tempReservationId")));

          finishSession();

          $timeout.cancel($scope.seconds);
        }
        $scope.seconds = $timeout($scope.onTimeout,1000);
      };

      var finishSession = function ( ) {
        SessionStorageService.delete("payloadApi");
        SessionStorageService.delete("tempReservationId");

        $scope.information.active=false;

        SessionStorageService.save("reservationInformation", JSON.stringify($scope.information));
      };


       $scope.seconds = $timeout($scope.onTimeout,1000);
    }

  })

  .controller('SubmitReservationController', function ($scope, $http, AuthenticationService, $location, ReservationService, SessionStorageService, $window) {
    $scope.information=JSON.parse(SessionStorageService.get("reservationInformation"));

    $scope.signInClick= function(){
      SessionStorageService.save("goBack", true);
      $location.path('/login');
    };

    $http.get("jsonexp/locations.json").then(
      function (response) {
        $scope.locations = response.data;
      }
    );


    //Registers user and if succesfull submits reservation
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


        $scope.loading= true;
        AuthenticationService.Register(payload, function (result) {
          $scope.loading= false;

            if (!result.status) {
              //go back so that login can go back to this window
              SessionStorageService.save("goBack", true);
              $location.path('/login');
            }
            else {
              $scope.error = result.data;
            }

        });
      }
    };

  });
