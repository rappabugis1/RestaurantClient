'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RestaurantsCtrl
 * @description
 * # RestaurantsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RestaurantsController', function (FilterFactoryServis, $scope, SessionStorageService, $location, $window, RestaurantService) {

    RestaurantService.getRestaurantLocations().then(function (response) {
      $scope.popularLocations = response.data;
    });

    $scope.range = function (count) {

      var ratings = [];

      for (var i = 0; i < count; i++) {
        ratings.push(i);
      }

      return ratings;
    };

    $scope.save= function(rest){
      SessionStorageService.save("restaurantId", JSON.stringify({id:rest.id}));
      $location.path('/restaurant');
    };

    //filter stuff
    //initialize values in the beginning
    $scope.searchText="";
    $scope.reservationInfo= null;
    $scope.pageNumber= 1;
    $scope.maxSize = 5;
    $scope.bigCurrentPage=1;

    //if coming from home search bar do this
    if(SessionStorageService.get("homeSearch")){
      $scope.reservationInfo=JSON.parse(SessionStorageService.get("homeSearch")).reservationInfo;
      $scope.searchText=JSON.parse(SessionStorageService.get("homeSearch")).searchText;
    }

    //on filter click
    $scope.filter= function () {

      //If filter has changed, delete the home search
      if(SessionStorageService.get("homeSearch") && $scope.searchText!==JSON.parse(SessionStorageService.get("homeSearch")).searchText){
          SessionStorageService.delete("homeSearch");
          $scope.reservationInfo=null;
      }

      //populate payload with data for search
      $scope.searchPayload = {
        itemsPerPage :9 ,
        pageNumber: $scope.bigCurrentPage,
        searchText: $scope.searchText,
        reservationInfo: $scope.reservationInfo ,
        mark : null,
        priceRange: null
      };

      FilterFactoryServis.getFilterResult($scope.searchPayload, function (response) {
        $scope.numPages = response.numberOfRestaurantPages*9;
        $scope.restaurants = response.restaurants;
        $window.scrollTo(0,0);
      });
    };

    //when coming to restaurants page trigger function once
    $scope.filter();

    //multiple select categories
    document.getElementById("categorymultiple").onmousedown= function(event) {
      event.preventDefault();
      event.target.selected=!event.target.selected;
    }

  });
