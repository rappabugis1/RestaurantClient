'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AdminpanelCtrl
 * @description
 * # AdminpanelCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AdminPanelController', function ($scope, FilterFactoryServis, AdminCommonService) {

    //Get counters

    AdminCommonService.getAdministrationCounters(function (response) {
      $scope.counters=response;
      $scope.loading=false;
    });



  })

  .controller('AdminRestaurantManipulationController', function ($scope, FilterFactoryServis, $window) {

    $scope.maxSize = 5;
    $scope.searchText="";
    $scope.bigCurrentPage=1;


    $scope.filter= function () {

      $scope.loading = true;

      //populate payload with data for search
      $scope.searchPayload = {
        itemsPerPage :9 ,
        pageNumber: $scope.bigCurrentPage,
        searchText: $scope.searchText
      };

      //Get categories from backend
      FilterFactoryServis.getAdminFilter('Restaurants',$scope.searchPayload, function (response) {

        if(response.data.numberOfPages!==0){

          $scope.filterResults= response.data.restaurants;
          $scope.numPages = response.data.numberOfPages*9;
          $scope.results=true;

        } else {

          $scope.results=false;

        }

        $window.scrollTo(0,0);
        $scope.loading = false;

      });

    };
    //Filter at the beginning
    $scope.filter();


    //AddTables

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


  })

  .controller('AdminLocationManipulationController', function ($scope, FilterFactoryServis, $window) {
    $scope.maxSize = 5;
    $scope.searchText="";
    $scope.bigCurrentPage=1;


    $scope.filter= function () {

      $scope.loading = true;

      //populate payload with data for search
      $scope.searchPayload = {
        itemsPerPage :9 ,
        pageNumber: $scope.bigCurrentPage,
        searchText: $scope.searchText
      };

      //Get categories from backend
      FilterFactoryServis.getAdminFilter('Locations',$scope.searchPayload, function (response) {

        if(response.data.numberOfPages!==0){

          $scope.filterResults= response.data.locations;
          $scope.numPages = response.data.numberOfPages*9;
          $scope.results=true;

        } else {

          $scope.results=false;

        }

        $window.scrollTo(0,0);
        $scope.loading = false;

      });

    };
    //Filter at the beginning
    $scope.filter();

  })

  .controller('AdminCategoryManipulationController', function ($scope, AdminCategoryService, FilterFactoryServis, $window){


    $scope.maxSize = 5;
    $scope.searchText="";
    $scope.bigCurrentPage=1;


    $scope.filter= function () {

      $scope.loading = true;

      //populate payload with data for search
      $scope.searchPayload = {
        itemsPerPage :9 ,
        pageNumber: $scope.bigCurrentPage,
        searchText: $scope.searchText
      };

      //Get categories from backend
      FilterFactoryServis.getAdminFilter('Categories',$scope.searchPayload, function (response) {

        if(response.data.numberOfPages!==0){

          $scope.filterResults= response.data.categories;
          $scope.numPages = response.data.numberOfPages*9;
          $scope.results=true;

        } else {

          $scope.results=false;

        }

        $window.scrollTo(0,0);
        $scope.loading = false;

      });

    };
    //Filter at the beginning
    $scope.filter();

    //Change category tab view watcher

    $scope.$watch('categoryName', function () {
      $scope.success="";
      $scope.error="";
    });

    $scope.view = false;

    $scope.currentCategory=null;
    $scope.categoryName ="";

    // change view false shows table, true shows edit
    $scope.changeView= function(changeType, cat){
      $scope.view = true;
      $scope.add=false;
      $scope.edit=false;

      $scope.currentCategory=null;
      $scope.categoryName="";

      if(changeType==='Edit') {
        $scope.edit = true;
        $scope.currentCategory=cat;
        $scope.categoryName=cat.name;
      }
      else
        $scope.add=true;
    };

    $scope.cancel=function(){
      $scope.view=false;
    };

    $scope.changeCategory= function (changeType) {
      $scope.success="";
      $scope.error="";

      switch (changeType) {
        case 'Add':
          if($scope.categoryName!==""){

            AdminCategoryService.addCategory({name:$scope.categoryName}, function (response) {

              if(response.status!==400){
                $scope.success="Category added successfully.";
              } else {
                $scope.error=response.data;
              }
            })
          }
          break;

        case 'Edit':
          if($scope.categoryName!==$scope.currentCategory.name && $scope.categoryName!==""){
            AdminCategoryService.editCategory({name:$scope.categoryName, id: $scope.currentCategory.id}, function (response) {

              if(response.status!==400){
                $scope.success="Category edited successfully.";
                $scope.filter();
              } else {
                $scope.error=response.data;
              }
            })
          } else {
            $scope.error = "Category already has the same name!";
          }
          break;
      }

    };

  })

  .controller('AdminUserManipulationController', function ($scope, FilterFactoryServis, $window) {

    $scope.maxSize = 5;
    $scope.searchText="";
    $scope.bigCurrentPage=1;


    $scope.filter= function () {

      $scope.loading = true;

      //populate payload with data for search
      $scope.searchPayload = {
        itemsPerPage :9 ,
        pageNumber: $scope.bigCurrentPage,
        searchText: $scope.searchText
      };

      //Get categories from backend
      FilterFactoryServis.getAdminFilter('Users',$scope.searchPayload, function (response) {

        if(response.data.numberOfPages!==0){

          $scope.filterResults= response.data.users;
          $scope.numPages = response.data.numberOfPages*9;
          $scope.results=true;

        } else {

          $scope.results=false;

        }

        $window.scrollTo(0,0);
        $scope.loading = false;

      });

    };
    //Filter at the beginning
    $scope.filter();


    //The manipulation part

    $scope.view = false;
    $scope.add=false;

    // change view false shows table, true shows edit
    $scope.changeView= function(changeType, user){
      $scope.view = true;

      if(changeType==='Add')
        $scope.add=true;
    };

    $scope.cancel=function(){
      $scope.filter();
      $scope.view=false;

    };

  });

