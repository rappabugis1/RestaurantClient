'use strict';

/**
 * @ngdoc service
 * @name clientApp.restaurant
 * @description
 * # restaurant
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('RestaurantService', function ($http) {


    // Public API here
    return {
      getMenu: function (menu, id) {
        return $http.post('/app/getRestaurantMenu', {idRestaurant: id, type: menu});
      },

      getRandomRestaurants: function () {
        return $http.get('/app/getRandomRestaurants');
      },

      getRestaurantLocations: function () {
        return $http.get('/app/getRestaurantLocations');
      },

      getRestaurantDetails: function (id) {
        return $http.post('/app/getRestaurantDetails', {Id: id});
      },

      insertComment: function (payload) {
        return $http.post('/app/insertComment', {
          mark: payload.mark,
          comment: payload.comment,
          idUser: payload.idUser,
          idRestaurant: payload.idRestaurant
        });
      }

    };
  });
