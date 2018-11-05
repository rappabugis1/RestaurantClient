'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RestaurantCtrl
 * @description
 * # RestaurantCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RestaurantCtrl', function ($http, $scope, share,$log ,Menu) {


    $scope.initialize = function(a,b) {
      $scope.mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(a, b)
      };
      $scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions);
    };

    $scope.loadScript = function(a,b) {

      if(window.google){
        setTimeout(function() {
          $scope.initialize(a,b);
        }, 500);
      } else{
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAy1-kceVQSwDE2b8zTxJhkQSJ2UAXKFek';
        document.body.appendChild(script);
        setTimeout(function() {
          $scope.initialize(a,b);
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

    $http.post('/app/getRestaurantDetails',{Id : 1}).then(function(response) {
      $scope.restaurant = response.data;
    });

    $scope.wow = function () {
      $scope.restaurant = share.get();
    };



  })

  .controller('ReviewCtrl', function ($scope, $uibModal, $document) {

    var $ctrl=this;

    $ctrl.items = ['item1', 'item2', 'item3'];

    $ctrl.animationsEnabled = true;

    $scope.rate = 3;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };

    $ctrl.open = function (size, parentSelector) {
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
        appendTo: parentElem,
        resolve: {
          items: function () {
            return $ctrl.items;
          }
        }
      });

    };


  })

  .controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = {
      item: $ctrl.items[0]
    };

    $ctrl.ok = function () {
      $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })

  .controller('MenuCtr', function($scope, $http,Menu,$log){


    $scope.arrayDishes = [];

    Menu.getDinner().then(function(response) {
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



  })
;

