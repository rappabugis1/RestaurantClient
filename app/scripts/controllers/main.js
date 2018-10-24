'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')

  .controller('MainCtrl', function ($scope,$http){


    $scope.restaurants=[
      {
        "restaurantName": "Riva",
        "mark": 5,
        "votes": 19,
        "priceRange": 4,
        "foodType": "International | Fast Food"
      },
      {
        "restaurantName": "Panera",
        "mark": 4,
        "votes": 42,
        "priceRange": 4,
        "foodType": "Red Meat | American"
      },
      {
        "restaurantName": "Nanina Kuhinja",
        "mark": 3,
        "votes": 53,
        "priceRange": 2,
        "foodType": "Traditional | Bosnian"
      },
      {
        "restaurantName": "Tasty Burger",
        "mark": 5,
        "votes": 95,
        "priceRange": 5,
        "foodType": "Fast Food | American"
      },
      {
        "restaurantName": "Piccolo Mondo",
        "mark": 3,
        "votes": 67,
        "priceRange": 4,
        "foodType": "Jewish | Mexican"
      },
      {
        "restaurantName": "Baja Fresh",
        "mark": 4,
        "votes": 50,
        "priceRange": 1,
        "foodType": "Vegetarian | Spanish"
      }
    ];

    $scope.range = function(count){

      var ratings = [];

      for (var i = 0; i < count; i++) {
        ratings.push(i);
      }

      return ratings;
    };

  });
