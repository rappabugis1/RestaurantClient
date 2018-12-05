'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RestaurantCtrl
 * @description
 * # RestaurantCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RestaurantController', function ($http, $scope, SessionStorageService, RestaurantService, $uibModalStack, $location, anchorSmoothScroll) {
    SessionStorageService.delete("reservationStartTime");

    //Get comments

    RestaurantService.getAllRestaurantComments(JSON.parse(SessionStorageService.get("restaurantId")).id, function (response) {
      $scope.reviews = response;

      $scope.noReviews = !($scope.reviews.length > 0);

    });

    $scope.$on('$locationChangeStart', handleLocationChange);

    function handleLocationChange() {
      $uibModalStack.dismissAll();
    }

    $scope.goTo = function(anchor){

        $location.hash(anchor);
        anchorSmoothScroll.scrollTo(anchor);
    };

    //map


    $scope.range = function (count) {

      var ratings = [];

      for (var i = 0; i < count; i++) {
        ratings.push(i);
      }

      return ratings;
    };

    RestaurantService.getRestaurantDetails(JSON.parse(SessionStorageService.get("restaurantId")).id).then(function (response) {
      $scope.restaurant = response.data;
      $scope.map = { center: { latitude: $scope.restaurant.latitude, longitude: $scope.restaurant.longitude }, zoom: 8 };
      $scope.marker = {coordinates: {latitude: $scope.restaurant.latitude, longitude: $scope.restaurant.longitude}};
    });

  })


  .controller('ReviewController', function ($scope, $uibModal, $document, $location, $localStorage, RestaurantService, SessionStorageService) {

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
        });
      } else {
        SessionStorageService.save("goBack", true);
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
  .service('anchorSmoothScroll', function(){

    this.scrollTo = function(eID) {

      var startY = currentYPosition();
      var stopY = document.getElementById(eID).offsetTop+200;
      var distance = stopY > startY ? stopY - startY : startY - stopY;
      if (distance < 100) {
        scrollTo(0, stopY); return;
      }
      var speed = 18;
      var step = Math.round(distance / 25);
      var leapY = stopY > startY ? startY + step : startY - step;
      var timer = 0;

      if (stopY > startY) {
        for ( var i=startY; i<stopY; i+=step ) {
          setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
          leapY += step; if (leapY > stopY) leapY = stopY; timer++;
        } return;
      }
      for ( var i=startY; i>stopY; i-=step ) {
        setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
      }

      function currentYPosition() {
        // Firefox, Chrome, Opera, Safari
        if (self.pageYOffset) return self.pageYOffset;
        // Internet Explorer 6 - standards mode
        if (document.documentElement && document.documentElement.scrollTop)
          return document.documentElement.scrollTop;
        // Internet Explorer 6, 7 and 8
        if (document.body.scrollTop) return document.body.scrollTop;
        return 0;
      }



    };

  });


