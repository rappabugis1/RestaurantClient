'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RestaurantCtrl
 * @description
 * # RestaurantCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RestaurantCtrl', function ($http, $scope, ShareDataService,RestaurantService) {


    $scope.initialize = function(a,b) {
      $scope.mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(a, b)
      };
      $scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions);
    };

    $scope.loadScript = function(a,b) {

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


    $scope.range = function(count){

      var ratings = [];

      for (var i = 0; i < count; i++) {
        ratings.push(i);
      }

      return ratings;
    };

    RestaurantService.getRestaurantDetails(ShareDataService.get().id ).then(function(response) {
      $scope.restaurant = response.data;
      $scope.loadScript($scope.restaurant.latitude, $scope.restaurant.longitude);
    });

  })

  .controller('ReviewCtrl', function ( $scope,$uibModal, $document, $log,  $location, $localStorage, RestaurantService, ShareDataService) {

    var $ctrl=this;


    $ctrl.animationsEnabled = true;

    $ctrl.open = function (size, parentSelector) {
      if($localStorage.currentUser){
        var parentElem = parentSelector ?
          angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
          animation: $ctrl.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          controllerAs: '$ctrl',
          size: size,
          appendTo: parentElem
        });

        modalInstance.result.then(function (payload) {
          payload={
            comment:payload.comment,
            mark:payload.mark,
            idUser : $localStorage.currentUser.currentUser.data.id,
            idRestaurant : ShareDataService.get().id
          };
          $log.info(payload);
          RestaurantService.insertComment(payload);

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      }else {
        $location.path('/login');
      }

    };


  })

  .controller('ModalInstanceCtrl', function ($uibModalInstance, $scope, $log) {
    var $ctrl = this;

    $scope.rate= 3;
    $scope.review="";

    $ctrl.ok = function () {

      var payload= {
        comment : $scope.review,
        mark : $scope.rate

      };
      $uibModalInstance.close(payload);
    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })

  .controller('MenuCtr', function($scope, RestaurantService){
    var $menu = this;

    $scope.arrayDishes = [];



    $menu.funkcija = function (type, id) {
      RestaurantService.getMenu(type, id).then(function(response) {
        var  menuData= response.data;
        var dishTypes= new Array;
        var arrayDishesLoc= new Array(0);

        menuData.forEach(function(element){
          if(!dishTypes.includes(element.dishType)){
            dishTypes.push(element.dishType);
            arrayDishesLoc.push(new Array(0));
            arrayDishesLoc[arrayDishesLoc.length-1].push(element);
          }else {
            arrayDishesLoc.forEach(function (value) {
              if(value[0].dishType===element.dishType){
                value.push(element);
              }
            });
          }

        });
        $scope.arrayDishes = arrayDishesLoc;
      });
    }("Dinner", 1);

  })
;

