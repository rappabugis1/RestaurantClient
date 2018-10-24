'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')

  .controller('MainCtrl', function ($scope){


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

    $scope.poplocs=[
      {
        "name": "West Willieville",
        "num_restaurants" : "3126"
      },
      {
        "name": "Denaton",
        "num_restaurants" : "3126"
      },
      {
        "name": "East Arthurbury",
        "num_restaurants" : "3126"
      },
      {
        "name": "Wittingberg",
        "num_restaurants" : "3126"
      },
      {
        "name": "South Conrad",
        "num_restaurants" : "3126"
      },
      {
        "name": "South Park",
        "num_restaurants" : "3126"
      },
      {
        "name": "Minas Tirith",
        "num_restaurants" : "3126"
      },
      {
        "name": "Mos Eisley Spaceport",
        "num_restaurants" : "3126"
      },
      {
        "name": "Jettieberg",
        "num_restaurants" : "3126"
      },
      {
        "name": "East Victoria",
        "num_restaurants" : "3126"
      },
      {
        "name": "Gisselleport",
        "num_restaurants" : "3126"
      },
      {
        "name": "New Graham",
        "num_restaurants" : "3126"
      },
      {
        "name": "Boyerborough",
        "num_restaurants" : "3126"
      },
      {
        "name": "Sokolovic Kolonija",
        "num_restaurants" : "3126"
      },
      {
        "name": "West Illa",
        "num_restaurants" : "3126"
      },
      {
        "name": "Heberchester",
        "num_restaurants" : "3126"
      },
      {
        "name": "Dragon Kings Layer",
        "num_restaurants" : "3126"
      },
      {
        "name": "Sarajevo",
        "num_restaurants" : "3126"
      },
      {
        "name": "Norfolk",
        "num_restaurants" : "3126"
      },
      {
        "name": "Chula Vista",
        "num_restaurants" : "3126"
      },
      {
        "name": "Oklahoma City",
        "num_restaurants" : "3126"
      },
      {
        "name": "San Antonio",
        "num_restaurants" : "3126"
      },
      {
        "name": "Hrasnica",
        "num_restaurants" : "3126"
      },
      {
        "name": "Novi Grad",
        "num_restaurants" : "3126"
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


