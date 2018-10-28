'use strict';

/**
 * @ngdoc service
 * @name clientApp.authentication
 * @description
 * # authentication
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('AuthenticationService', function ($http, $localStorage) {

    var service= {};

    function Login(username, password, callback) {
      $http.post('/login', { username: username, password: password })
        .then(function onSucces(response) {
          // login successful if there's a token in the response
          if (response.token) {
            // store username and token in local storage to keep user logged in between page refreshes
            $localStorage.currentUser = { username: username, token: response.token };

            // add jwt token to auth header for all requests made by the $http service
            $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;

            // execute callback with true to indicate successful login
            callback(true);
          } else {
            // execute callback with false to indicate failed login
            callback(false);

          }
        })
        .catch(function onError(response){

          callback(false);

        });
    }

    function Register(payload, callback){
      $http.post('app/register', payload)
        .then(function onSucces(response) {
          // login successful if there's a token in the response
          if (response.token) {

            // store username and token in local storage to keep user logged in between page refreshes
            $localStorage.currentUser = { username: payload.username, token: response.token };

            // add jwt token to auth header for all requests made by the $http service
            $http.defaults.headers.common.Authorization = 'Bearer ' + response.token;

            // execute callback with true to indicate successful login
            callback(true);
          } else {
            // execute callback with false to indicate failed login
            callback(false);
          }
        })
        .catch(function onError(response){

          callback(false);

        });
    }

    function Logout() {
      // remove user from local storage and clear http auth header
      delete $localStorage.currentUser;
      $http.defaults.headers.common.Authorization = '';
    }

    service.Login = Login;
    service.Register= Register;
    service.Logout = Logout;

    return service;
  });
