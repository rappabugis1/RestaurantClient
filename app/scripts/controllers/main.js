'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')

  .controller('MainCtrl', function ($scope, $http, $window){

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


    $http.get('jsonexp/restaurants.json').then(function(response) {
      $scope.restaurants = response.data;
    });

    $http.get('jsonexp/poplocations.json').then(function(response) {
      $scope.poplocs = response.data;
    });


  })
  .directive('resize', function ($window) {
    return function (scope, element) {
      var w = angular.element($window);
      scope.getWindowDimensions = function () {
        return {
          'h': w.height(),
          'w': w.width()
        };
      };
      scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
        scope.windowHeight = newValue.h;
        scope.windowWidth = newValue.w;

        scope.style = function () {
          return {
            'height': (newValue.h - 100) + 'px',
            'width': (newValue.w - 100) + 'px'
          };
        };

      }, true);

      w.bind('resize', function () {
        scope.$apply();
      });
    }
  });


