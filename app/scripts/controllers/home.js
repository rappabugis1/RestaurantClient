'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')

  .controller('MainCtrl', function ($scope, $http, ShareDataService, $location, RestaurantService){

    $scope.dishes=[
      {
        "heading" : "Best pizza of 2016",
        "location" : "New York",
        "numRestaurants" : 43
      },
      {
        "heading" : "Best cevapi",
        "location" : "Sarajevo",
        "numRestaurants" : 28
      },
      {
        "heading" : "Fresh and Spicy",
        "location" : "Philladelphia",
        "numRestaurants" : 16
      },
      {
        "heading" : "Cupcakes Flavor",
        "location" : "Chicago",
        "numRestaurants" : 11
      }
    ];

    $scope.range = function(count){

      var ratings = [];

      for (var i = 0; i < count; i++) {
        ratings.push(i);
      }

      return ratings;
    };

    $scope.save= function(rest){
      ShareDataService.add(rest);
      $location.path('/restaurant');
    };

    RestaurantService.getRandomRestaurants().then(function(response) {
      $scope.restaurants = response.data;
    });

    RestaurantService.getRestaurantLocations().then(function(response) {
      $scope.poplocs = response.data;
    });


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
  });


