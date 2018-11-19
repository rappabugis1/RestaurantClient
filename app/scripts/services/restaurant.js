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
        return $http.post('https://ridvansrestaurantserver.herokuapp.com/app/getRestaurantMenu', {idRestaurant: id, type: menu});
      },

      getRandomRestaurants: function () {
        return $http.get('https://ridvansrestaurantserver.herokuapp.com/app/getRandomRestaurants');
      },

      getRestaurantLocations: function () {
        return $http.get('https://ridvansrestaurantserver.herokuapp.com/app/getRestaurantLocations');
      },

      getRestaurantDetails: function (id) {
        return $http.post('https://ridvansrestaurantserver.herokuapp.com/app/getRestaurantDetails', {Id: id});
      },

      insertComment: function (payload) {
        return $http.post('https://ridvansrestaurantserver.herokuapp.com/app/insertComment', {
          mark: payload.mark,
          comment: payload.comment,
          idUser: payload.idUser,
          idRestaurant: payload.idRestaurant
        });
      },

      getAllRestaurantComments : function (id, callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/getAllRestaurantComments', {idRestaurant : id})
          .then(function onSucces(response) {

          //If succesfull return data
          callback(response.data);
          })
          .catch(function onError(error) {
            if (error.status === 400) {
              callback(error.data);
            }
          });
      }

    };
  });
