'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RestaurantCtrl
 * @description
 * # RestaurantCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RestaurantController', function ($http, $scope, SessionStorageService, RestaurantService, $uibModalStack) {

    $scope.$on('$locationChangeStart', handleLocationChange);

    function handleLocationChange() {
      $uibModalStack.dismissAll();
    }

    $scope.initialize = function (a, b) {
      $scope.mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(a, b)
      };
      $scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions);
    };

    $scope.loadScript = function (a, b) {

      if (window.google) {
        setTimeout(function () {
          $scope.initialize(a, b);
        }, 500);
      } else {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAy1-kceVQSwDE2b8zTxJhkQSJ2UAXKFek';
        document.body.appendChild(script);
        setTimeout(function () {
          $scope.initialize(a, b);
        }, 500);
      }

    };


    $scope.range = function (count) {

      var ratings = [];

      for (var i = 0; i < count; i++) {
        ratings.push(i);
      }

      return ratings;
    };

    RestaurantService.getRestaurantDetails(JSON.parse(SessionStorageService.get("restaurantId")).id).then(function (response) {
      $scope.restaurant = response.data;
      $scope.loadScript($scope.restaurant.latitude, $scope.restaurant.longitude);
    });

  })


  .controller('ReviewController', function ($scope, $uibModal, $document, $log, $location, $localStorage, RestaurantService, SessionStorageService) {

    var $ctrl = this;


    $ctrl.animationsEnabled = true;

    $ctrl.open = function (size, parentSelector) {
      if ($localStorage.currentUser) {
        var parentElem = parentSelector ?
          angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
          animation: $ctrl.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceController',
          controllerAs: '$ctrl',
          size: size,
          appendTo: parentElem
        });

        modalInstance.result.then(function (payload) {
          payload = {
            comment: payload.comment,
            mark: payload.mark,
            idUser: $localStorage.currentUser.currentUser.data.id,
            idRestaurant: JSON.parse(SessionStorageService.get("restaurantId")).id
          };
          RestaurantService.insertComment(payload);

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      } else {
        $location.path('/login');
      }

    };


  })

  .controller('ModalInstanceController', function ($uibModalInstance, $scope) {
    var $ctrl = this;

    $scope.rate = 3;
    $scope.review = "";

    $ctrl.ok = function () {

      var payload = {
        comment: $scope.review,
        mark: $scope.rate

      };
      $uibModalInstance.close(payload);
    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })

  .controller('MenuController', function ($scope, RestaurantService, SessionStorageService) {
    var $menu = this;

    $scope.arrayDishes = [];

    $menu.getMenu = function (type) {
      RestaurantService.getMenu(type.toString(), JSON.parse(SessionStorageService.get("restaurantId")).id).then(function (response) {
        var menuData = response.data;
        var dishTypes = [];
        var arrayDishesLoc = [];

        menuData.forEach(function (element) {
          if (!dishTypes.includes(element.dishType)) {
            dishTypes.push(element.dishType);
            arrayDishesLoc.push(new Array(0));
            arrayDishesLoc[arrayDishesLoc.length - 1].push(element);
          } else {
            arrayDishesLoc.forEach(function (value) {
              if (value[0].dishType === element.dishType) {
                value.push(element);
              }
            });
          }

        });
        $scope.arrayDishes = arrayDishesLoc;
      });
    };

    $menu.text = "Show full menu";
    $menu.tick = false;

    $menu.showMenu = function () {
      if ($menu.tick) {
        $menu.text = "Show full menu";
        $menu.tick = false;
        $menu.myHeight = '350px';
      }
      else {
        $menu.text = "See less";
        $menu.tick = true;
        $menu.myHeight = 'none';

      }
    };

    $menu.getMenu('Dinner');

  })
;

