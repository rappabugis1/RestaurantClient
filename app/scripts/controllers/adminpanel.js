'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AdminpanelCtrl
 * @description
 * # AdminpanelCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AdminPanelController', function ($scope, $window, FilterFactoryServis, AdminCommonService) {



    $scope.currentPanel = 'Dashboard';
    $scope.currentObject= '';
    $scope.maxSize = 5;
    $scope.searchText="";
    $scope.loading=true;

    //Get counters

    AdminCommonService.getAdministrationCounters(function (response) {
      $scope.counters=response;
      $scope.loading=false;
    });

    //Change panel
    $scope.changePanel = function (nextPanel) {
      $scope.currentPanel=nextPanel;
      $scope.currentObject= '';

      //TODO stop this on add
      if($scope.currentPanel!=='Dashboard' && $scope.currentObject===''){
        $scope.filter(1);
      }

      $window.scrollTo(0,0);
    };

    $scope.filter= function (page) {

      $scope.loading = true;

      //populate payload with data for search
      $scope.searchPayload = {
        itemsPerPage :9 ,
        pageNumber: page,
        searchText: $scope.searchText
      };

      FilterFactoryServis.getAdminFilter($scope.currentPanel,$scope.searchPayload, function (response) {
        if(response.data.numberOfPages!==0){
          switch ($scope.currentPanel) {
            case 'Users':
              $scope.filterResults= response.data.users;
              break;
            case 'Locations':
              $scope.filterResults= response.data.locations;
              break;
            case 'Categories':
              $scope.filterResults= response.data.categories;
              break;
            case 'Restaurants':
              $scope.filterResults= response.data.restaurants;
              break;
          }
          $scope.numPages = response.data.numberOfPages*9;
          $scope.results=true;
        } else {
          $scope.results=false;
        }

        $window.scrollTo(0,0);
        $scope.loading = false;
      });
    };

    $scope.changeObject = function () {
      $scope.currentObject=$scope.currentPanel;
    };

  })

  .controller('AdminRestaurantPanelController', function ($scope) {

    //Tables

    $scope.tablesList=
      [ {id: 'Select type of tables', label: 'Select type of tables', disabled : true},
        { id: 'Tables for one', label: 'Tables for one' },
        { id: 'Tables for two', label: 'Tables for two' },
        { id: 'Tables for three', label: 'Tables for three'},
        { id: 'Tables for four', label: 'Tables for four'},
        { id: 'Tables for five', label: 'Tables for five'},
        { id: 'Tables for six', label: 'Tables for six'},
        { id: 'Tables for seven', label: 'Tables for seven'},
        { id: 'Tables for eight', label: 'Tables for eight'},
        { id: 'Tables for nine', label: 'Tables for nine'},
        { id: 'Tables for ten', label: 'Tables for ten'}];

    $scope.tablesPayload = [];


    $scope.addNewTables = function () {
      $scope.tablesPayload.push({tableType: $scope.tablesList[0].label, amount: ""});
    };

    $scope.removeTables = function(index, type) {

      $scope.changeDisabled(type, false);

      $scope.tablesPayload.splice(index,1);

    };

    $scope.typeChanged= function(newtype, oldtype) {
      $scope.changeDisabled(newtype, true);
      $scope.changeDisabled(oldtype, false);
    };

    $scope.changeDisabled= function(type, toDisabled){

      if(type && type!=='Select type of tables'){
        $scope.tablesList.forEach(function (element, index) {
          if(element.label===type)
            $scope.typeIndex=index;
        });

        $scope.tablesList[$scope.typeIndex].disabled=toDisabled;
      }
    };

    //Tables End


    //Dishes

    $scope.dishes = [];

    $scope.radioModel = 'Breakfast';

    $scope.addNewDish = function (menuType) {
      $scope.dishes.push({name: "", description: "", price: "", dishType: "", menuType: menuType})
    };

    $scope.removeDish = function(index) {
      $scope.dishes.splice(index,1);
    };

    //Dishes End


  });
