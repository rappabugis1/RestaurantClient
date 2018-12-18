'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RestaurantsCtrl
 * @description
 * # RestaurantsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RestaurantsController', function (FilterFactoryServis, $scope, SessionStorageService, $location, $window, RestaurantService,GeometryService) {

    RestaurantService.getRestaurantLocations().then(function (response) {
      $scope.popularLocations = response.data;
    });

    GeometryService.getCurrentPos().then(function () {
      $scope.disableRange=false;
    })
      .catch(function () {
        $scope.disableRange=true;

      });
    $scope.radiusHowMuch = "1 kilometer";

    $scope.rangeGeo=0;
    $scope.radius=100;
    $scope.rangeController = function(){

      if($scope.radius<=20){
        $scope.radiusHowMuch = $scope.radius/5+1 + " kilometers";
        $scope.rangeGeo=($scope.radius/5+1)*1000;
      }

      if($scope.radius>25){
        $scope.rangeGeo=($scope.radius-20)*1000;
        $scope.radiusHowMuch = $scope.radius-20 + " kilometers";
      }

      if($scope.radius===0){
        $scope.radiusHowMuch = "Near you";
        $scope.rangeGeo=1000;
      }

      if($scope.radius===100){
        $scope.radiusHowMuch = "World-wide";
        $scope.rangeGeo=0;
      }


    };
    $scope.rangeController();

    $scope.filterLocations= function (name) {
      $scope.searchText=name;
      $scope.filter();
    };

    $scope.range = function (count) {

      var ratings = [];

      for (var i = 0; i < count; i++) {
        ratings.push(i);
      }

      return ratings;
    };

    $scope.save= function(rest){
      SessionStorageService.save("restaurantId", JSON.stringify({id:rest.id}));

      if($scope.alertHidden===false){
        SessionStorageService.save("reservationInfo", JSON.stringify($scope.reservationInfo));
      }

      $location.path('/restaurant');
    };

    //filter stuff
    //initialize values in the beginning
    $scope.searchText="";
    $scope.reservationInfo= null;
    $scope.pageNumber= 1;
    $scope.maxSize = 5;
    $scope.bigCurrentPage=1;
    $scope.rate=null;
    $scope.price=null;
    $scope.categoriesLeft=[];
    $scope.categoriesRight=[];
    $scope.alertHidden = true;


    //if coming from home search bar do this
    if(SessionStorageService.get("homeSearch")){
      $scope.alertHidden = false;
      $scope.reservationInfo=JSON.parse(SessionStorageService.get("homeSearch")).reservationInfo;
      $scope.searchText=JSON.parse(SessionStorageService.get("homeSearch")).searchText;
      SessionStorageService.delete("homeSearch");
    }
    if(SessionStorageService.get("locationSearch")){
      $scope.searchText=JSON.parse(SessionStorageService.get("locationSearch"));
      SessionStorageService.delete("locationSearch");

    }

    //close alert

    $scope.closeAlert = function (){
      $scope.alertHidden = true;
      $scope.reservationInfo=null;
      $scope.filter();
    };

    //on filter click
    $scope.filter= function () {

      $scope.loading = true;

      //populate payload with data for search
      $scope.searchPayload = {
        itemsPerPage :9 ,
        pageNumber: $scope.bigCurrentPage,
        searchText: $scope.searchText,
        reservationInfo: $scope.reservationInfo ,
        mark : $scope.rate,
        priceRange: $scope.price,
        categories: getSelectedOptions("categorymultipleright").concat(getSelectedOptions("categorymultipleleft"))
      };

      if($scope.rangeGeo!==0){
        GeometryService.getCurrentPos().then(function(position){
          $scope.searchPayload.geometry= {radius: $scope.rangeGeo, latitude: position.coords.latitude, longitude: position.coords.longitude};

          FilterFactoryServis.getFilterResult($scope.searchPayload, function (response) {
            if(response.numberOfPages!==0){
              $scope.numPages = response.numberOfPages*9;
              $scope.restaurants = response.restaurants;
              $scope.noResults=false;
            } else {
              $scope.noResults=true;
            }

            $window.scrollTo(0,0);
            $scope.loading = false;
          });

        })
      }else {
        FilterFactoryServis.getFilterResult($scope.searchPayload, function (response) {
          if(response.numberOfPages!==0){
            $scope.numPages = response.numberOfPages*9;
            $scope.restaurants = response.restaurants;
            $scope.noResults=false;
          } else {
            $scope.noResults=true;
          }

          $window.scrollTo(0,0);
          $scope.loading = false;
        });
      }


    };

    //when coming to restaurants page trigger function once
    $scope.filter();

    //multiple select categories
    document.getElementById("categorymultipleright").onmousedown= function(event) {
      event.preventDefault();
      event.target.selected=!event.target.selected;
    };

    document.getElementById("categorymultipleleft").onmousedown= function(event) {
      event.preventDefault();
      event.target.selected=!event.target.selected;
    };


    //Get categories and half them to two arrays
    FilterFactoryServis.getAllCategories(function (response) {
      $scope.categories =
        {
          left: response.splice(0, Math.ceil(response.length/2)),
          right: response
        };
    });

    //TODO there is a problem with multiple select with event.preventDefault(), it prevents adding the category to selected items so angularjs binding does not work
    //TODO so i made it the old fashion way by combing through the options to see which is selected

    function getSelectedOptions(idelement) {
      var opts = [],
        opt;
      var len = document.getElementById(idelement).options.length;

      for (var i = 0; i < len; i++) {
        opt = document.getElementById(idelement).options[i];

        if (opt.selected) {
          opts.push(opt.label);
        }
      }

      return opts;
    }


  });
