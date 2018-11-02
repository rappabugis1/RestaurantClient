'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RestaurantCtrl
 * @description
 * # RestaurantCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RestaurantCtrl', function ($http, $scope) {

    $scope.initialize = function(a,b) {
      $scope.mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(a, b)
      };
      $scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions);
    }

    $scope.loadScript = function(a,b) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAy1-kceVQSwDE2b8zTxJhkQSJ2UAXKFek&callback=initialize';
      document.body.appendChild(script);
      setTimeout(function() {
        $scope.initialize(a,b);
      }, 500);
    }

    $http.get('jsonexp/onerestaurant.json').then(function(response) {
      $scope.restaurant = response.data;
    });


    $scope.range = function(count){

      var ratings = [];

      for (var i = 0; i < count; i++) {
        ratings.push(i);
      }

      return ratings;
    };




  });
