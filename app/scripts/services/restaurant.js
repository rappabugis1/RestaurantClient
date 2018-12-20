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
      },

      adminSaveRestaurant : function (payload, callback) {
        if(payload.id){
          $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/editRestaurant', payload) .then( function onSucces(response){
            callback(response);
          });
        }else{
          $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/addRestaurant', payload) .then( function onSucces(response){
            callback(response);
          });
        }

      },

      restaurantMenuItems : function (payload, callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/adminMenuItems', payload). then(function onSucces(response){
          callback(response);
        });
      },

      getDishTypes : function (callback){
        $http.get('https://ridvansrestaurantserver.herokuapp.com/app/admin/getAllDishTypes'). then (function (response) {
          callback(response);
        });
      },

      restaurantTables : function (payload, callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/adminRestaurantTables', payload) .then(function (response) {
          callback(response);
        });
      },

      restaurantReservationLengths : function (payload, callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/adminRestaurantReservationLengths', payload) .then(function (response) {
          callback(response);
        })
      },

      deleteRestaurant : function (payload, callback) {
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/adminDeleteRestaurant', payload) .then(function (reponse) {
          callback(reponse);
        });
      }
      ,

      getAdminDetails: function (payload, callback){
        $http.post('https://ridvansrestaurantserver.herokuapp.com/app/admin/adminGetDetails', payload)
          .then (function onSuccess(response) {
            callback(response);
          })
          .catch(function onError(response) {
            if(response.status===400){
              callback(response);
            }
          })
      }

    };
  });
