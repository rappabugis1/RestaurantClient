'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController',
        controllerAs: 'main'
      })

      .when('/login',{
        templateUrl:   'views/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })

      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterController',
        controllerAs: 'register'

      })

      .when('/restaurant',{
        templateUrl: 'views/restaurant.html',
        controller: 'RestaurantController',
        controllerAs: 'restaurant'

      })

      .when('/reservation',{
        templateUrl: 'views/reservation.html',
        controller: 'ReservationController'
      })

      .when('/restaurants',{
        templateUrl: 'views/restaurants.html',
        controller: 'RestaurantsController'
      })

      .when('/myreservations',{
        templateUrl: 'views/myreservations.html',
        controller: 'MyReservationsController'
      })

      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller : 'AdminPanelController'
      })

      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.hashPrefix('');

  })
  .run(function ($rootScope, $http, $location, $localStorage, $window) {
    // keep user logged in after page refresh
    if ($localStorage.currentUser) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    // if tries to go back to reservation page, itll go back to restaurant page
    $rootScope.$on('$locationChangeStart', function () {
      var publicPages = ['/login', '/', '', '/register', '/restaurant', '/reservation', '/restaurants'];
      var restrictedPage = publicPages.indexOf($location.path()) === -1;
      if ((restrictedPage && !$localStorage.currentUser)) {
        $location.path('/login');
      }

      if($location.path()==='/admin' && !isAdmin()){
        $location.path('/login');
      }

    });

    var isAdmin = function () {
      if($localStorage.currentUser){
        var token = $localStorage.currentUser.token;
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        var json= JSON.parse(atob(base64));

        return json.user_type.toString()==="admin";
      }
      return false;
    };

    $rootScope.$on('$routeChangeSuccess', function () {
      $window.scrollTo(0,0);
    });

  }

)

  ;



