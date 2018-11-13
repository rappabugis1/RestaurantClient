'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RestaurantsCtrl
 * @description
 * # RestaurantsCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RestaurantsController', function (FilterFactoryServis, $scope, SessionStorageService, $location) {


    FilterFactoryServis.getFilterResult({itemsPerPage : 9, pageNumber : 1, searchText : ""}, function (response) {
      $scope.numPages = response.numberOfRestaurantPages*9;
      $scope.restaurants = response.restaurants;
    });

    $scope.pageChanged = function() {
      FilterFactoryServis.getFilterResult({itemsPerPage : 9, pageNumber : $scope.bigCurrentPage, searchText : ""}, function (response) {
        $scope.numPages = response.numberOfRestaurantPages*9;
        $scope.restaurants = response.restaurants;
      });
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
      $location.path('/restaurant');
    };

    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;
  });
