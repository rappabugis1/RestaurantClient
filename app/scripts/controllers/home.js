'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')

  .controller('HomeController', function ($scope, $http, SessionStorageService, $location, RestaurantService, GeometryService){

    $scope.closeRests=54;
    GeometryService.getNumberForHome(function (number) {
      if(number!==-1){
        $scope.closeRests= number.data;
        $scope.noGeoLoc=false;
      }
      else{
        $scope.noGeoLoc=true;
      }

    });

    $scope.dishes = [
      {
        "heading": "Best pizza of 2016",
        "location": "Cazin",
        "numRestaurants": 8,
        "img" :"https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
      },
      {
        "heading": "Rice over the Orient",
        "location": "Sarajevo",
        "numRestaurants": 1,
        "img" : "https://images.pexels.com/photos/1306548/pexels-photo-1306548.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
      },
      {
        "heading": "Fresh and Spicy",
        "location": "Kljuc",
        "numRestaurants": 3,
        "img" :"https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
      },
      {
        "heading": "Turkish kebab 2018",
        "location": "Mostar",
        "numRestaurants": 5,
        "img" : "https://images.pexels.com/photos/604660/pexels-photo-604660.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
      },
      {
        "heading": "Delicious sweets",
        "location": "Travnik",
        "numRestaurants": 5,
        "img" : "https://images.pexels.com/photos/8382/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
      },
      {
        "heading": "Fresh and Spicy 2",
        "location": "Maglaj",
        "numRestaurants": 9,
        "img" : "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=540&w=680"

      }
    ];

    $scope.numberRepeat=Math.ceil($scope.dishes.length/3);

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

    RestaurantService.getRandomRestaurants().then(function (response) {
      $scope.restaurants = response.data;
    });

  })

  .controller('PopularLocationsController', function ($scope, RestaurantService, SessionStorageService, $location) {
    RestaurantService.getRestaurantLocations().then(function (response) {
      $scope.popularLocations = response.data;
    });

    $scope.filterLocations= function (name) {
      SessionStorageService.save("locationSearch", JSON.stringify(name));
      $location.path('/restaurants');
    };

  })

  .directive('resize', function ($window) {
    return function (scope) {
      var w = angular.element($window);
      scope.getWindowDimensions = function () {
        return {
          'w': w.width()
        };
      };
      scope.$watch(scope.getWindowDimensions, function (newValue) {
        scope.windowWidth = newValue.w;

        scope.style = function () {
          return {
            'width': (newValue.w - 100) + 'px'
          };
        };

      }, true);

      w.bind('resize', function () {
        scope.$apply();
      });
    };
  })
;


