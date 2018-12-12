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

    $scope.activeTab=0;

    //Get counters
    AdminCommonService.getAdministrationCounters(function (response) {
      $scope.counters=response;
      $scope.loading=false;
    });

    $scope.changeActive=function (index) {
      $scope.activeTab=index;
    };

  })

  .controller('AdminRestaurantManipulationController', function ($scope, FilterFactoryServis,$log, $window, fileReader, AdminLocationService, AdminCategoryService, FirestoreService, RestaurantService)  {

    var rest = this;


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

    //Restaurant payloads

    $scope.pickedCatPayload=[];
    $scope.tablesPayload = [];
    $scope.reservationLengths =[];

    //imagesurl
    $scope.imageLogoUrl = "";
    $scope.imageCoverUrl = "";




    //Price Range
    $scope.priceRanges = ['Low', 'Lower Medium', 'Medium', 'Upper Medium', 'High'];

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



    $scope.addNewTables = function () {
      $scope.tablesPayload.push({tableType: $scope.tablesList[0].label, amount: ""});
    };

    //add three place holders tables
    $scope.addNewTables();
    $scope.addNewTables();
    $scope.addNewTables();



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

    RestaurantService.getDishTypes(function (response) {
      $scope.dishTypes= response.data;
    });

    $scope.dishesPayload = {
      addQueue: [],
      editQueue: [],
      deleteQueue: [],
      restaurantId: ""
    };

    $scope.dishes=[];

    $scope.radioModel = 'Breakfast';

    $scope.addNewDish = function (menuType) {
      $scope.dishes.push({name: "", description: "", price: "", dishType: "", menuType: menuType})
    };

    $scope.removeDish = function(index) {

      //If deleted dish has an id, put it in delete queue
      if($scope.dishes[index].id)
        $scope.dishesPayload.deleteQueue.push($scope.dishes[index].id);

      $scope.dishes.splice(index,1);
    };

    $scope.editDish = function(index){
      //if dish has id and not in queue, put it in edit queue
      if($scope.dishes[index].id && $scope.dishesPayload.editQueue.indexOf($scope.dishes[index]))
        $scope.dishesPayload.editQueue.push($scope.dishes[index]);
    };

    //Add three placeholder dishes
    $scope.addNewDish('Breakfast');
    $scope.addNewDish('Breakfast');
    $scope.addNewDish('Breakfast');

    //Dishes End


    $scope.view = false;


    // change view false shows table, true shows edit
    $scope.changeView= function(changeType, restaurant){
      $scope.view = true;
      $scope.add=false;
      $scope.edit=false;

      if(changeType==='Edit') {
        $scope.edit = true;
      }
      else
        $scope.add=true;
    };

    $scope.cancel=function(){
      $scope.view=false;
    };




    //Locations

    AdminLocationService.getLocationsForSelect(function (response) {
      if(response.status!==400){
        $scope.locations = response.data;

      }
    });

    //Categories

    $scope.pickedCategories= [];

    AdminCategoryService.getAllCategories(function (response) {
      if(response.status!==400){
        $scope.categories = response.data;
      }
    });

    $scope.pickCategory= function(category){
      if($scope.pickedCategories.indexOf(category.name)===-1) {
        $scope.pickedCategories.push(category.name);
        $scope.pickedCatPayload.push(category.id);
      }
    };

    $scope.deleteCategory = function (index) {
      $scope.pickedCategories.splice(index,1);
      $scope.pickedCatPayload.splice(index,1);

    };


    //Map

    $scope.map= {center:{latitude: 43.85626, longitude: 18.41308},  zoom: 8};
    $scope.marker = {
      coordinates:{latitude: 43.85626, longitude: 18.41308},
      events :{
        click: function (map, event,args) {
                  $scope.marker.coordinates.latitude=args[0].latLng.lat();
                  $scope.marker.coordinates.longitude=args[0].latLng.lng();
        }
        }
    };

    //Reservation lengths


    $scope.addLength = function () {
      $scope.reservationLengths.push({guestNumber: "", workday: {morning: "", day: "", evening: ""},  weekend: {morning: "", day: "", evening: ""}});
    };

    $scope.removeLength = function (index) {
      $scope.reservationLengths.splice(index, 1);
    };


    //Image Upload
    rest.imageLogoSrc="";
    rest.imageCoverSrc="";

    //Images

    $scope.$on("fileProgress", function(e, progress) {
      $scope.progress = progress.loaded / progress.total;
    });

    //Basic info

    //Form validation

    //////BasicDetailsForm

    $scope.changeLoc = function(){ rest.restLocInv=false };

    $scope.changePrice = function() {rest.restPriceInv=false};

    $scope.$watchCollection('pickedCategories',function () { rest.restCatInv=false; });


    var validateBasicDetails= function () {

      if($scope.pickedCatPayload.length===0)
        rest.restCatInv=true;
      
      if($scope.priceRanges.indexOf(rest.priceRange)===-1)
        rest.restPriceInv=true;
      
      if(!rest.city)
        rest.restLocInv=true;
      
      if(!$scope.imageLogoUrl)
        rest.logoInv=true;
      
      if(!$scope.imageCoverUrl)
        rest.coverInv=true;
      
    };

    
    $scope.addRestaurant = function (isValid) {
      $scope.submited=true;

      validateBasicDetails();

      if(isValid && $scope.pickedCatPayload.length>0){

        $scope.progress=15;
        $scope.currentTask="Uploading images...";

        //upload logo
        FirestoreService.uploadImage(rest.imageLogoSrc, function (downloadUrl) {
          $scope.imageLogoUrl=downloadUrl;

          $scope.progress=30;

          //then => upload cover
          FirestoreService.uploadImage(rest.imageCoverSrc, function (downloadUrl) {
            $scope.imageCoverUrl=downloadUrl;

            $scope.progress=50;
            $scope.currentTask="Saving restaurant...";

            $scope.basicInfoPayload = {
              longitude: $scope.marker.coordinates.longitude,
              latitude: $scope.marker.coordinates.latitude,
              restaurantName : rest.restaurantName,
              priceRange: $scope.priceRanges.indexOf(rest.priceRange) +1,
              location: rest.city.id,
              description: rest.resDescription,
              imageFileName: $scope.imageLogoUrl,
              coverFileName: $scope.imageCoverUrl,
              categories: $scope.pickedCatPayload,
              defaultStay: $scope.defaultLength
            };

            //then => save rest
            RestaurantService.adminAddRestaurant($scope.basicInfoPayload, function (response) {
              $scope.progress=60;
              $scope.currentTask="Adding menu...";

              //Add NEW dishes to payload
              $scope.dishes.forEach(function (value) {
                $scope.dishesPayload.addQueue.push(value);
              });

              $scope.dishesPayload.restaurantId=response.data.id;

              //then => save menu
              RestaurantService.restaurantMenuItems($scope.dishesPayload, function (response) {

                $scope.progress=70;
                $scope.currentTask="Adding tables...";
              });
            });

          });

        });

      }

    }


  })

  .controller('AdminLocationManipulationController', function ($scope, FilterFactoryServis, $window, AdminLocationService) {
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

    //Change category tab view watcher

    $scope.$watch('locationName', function () {
      $scope.success="";
      $scope.error="";
    });

    $scope.view = false;

    $scope.currentCategory=null;
    $scope.categoryName ="";

    // change view false shows table, true shows edit
    $scope.changeView= function(changeType, location){
      $scope.view = true;
      $scope.add=false;
      $scope.edit=false;

      $scope.currentLocation=null;
      $scope.locationName="";
      $scope.countryName="";


      if(changeType==='Edit') {
        $scope.edit = true;
        $scope.currentLocation=location;
        $scope.id=location.id;
        $scope.locationName=location.name;
        $scope.countryName=location.country;
      }
      else
        $scope.add=true;
    };

    $scope.cancel=function(){
      $scope.view=false;
    };

    $scope.changeLocation= function (changeType) {
      $scope.success="";
      $scope.error="";

      switch (changeType) {
        case 'Add':
          if($scope.locationName!==""){

            AdminLocationService.addLocation({name:$scope.locationName, country: $scope.countryName}, function (response) {

              if(response.status!==400){
                $scope.success="Location added successfully.";
              } else {
                $scope.error=response.data;
              }
            })
          }
          break;

        case 'Edit':
          if($scope.locationName!==$scope.currentLocation.name && $scope.locationName!==""){
            AdminLocationService.editLocation({id: $scope.id,name:$scope.locationName, country: $scope.countryName}, function (response) {

              if(response.status!==400){
                $scope.success="Location edited successfully.";
                $scope.filter();
              } else {
                $scope.error=response.data;
              }
            })
          } else {
            $scope.error = "Location already has the same name!";
          }
          break;
      }

    };

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

  .controller('AdminUserManipulationController', function ($scope, FilterFactoryServis, $window, $http, AuthenticationService, AdminUserService, AdminLocationService) {

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
      $scope.add=false;
      $scope.edit=false;

      $scope.currentUser=null;
      $scope.email = null;
      $scope.firstName=null;
      $scope.lastName=null;
      $scope.phone = null;
      $scope.id=null;

      if(changeType==='Edit') {

        //TODO LOCATION
        $scope.edit = true;
        $scope.currentUser=user;
        $scope.email = user.email;
        $scope.firstName=user.user_data.firstName;
        $scope.lastName=user.user_data.lastName;
        $scope.phone = user.user_data.phone;
        $scope.id=user.id;
      }
      else
        $scope.add=true;
    };

    $scope.cancel=function(){
      $scope.filter();
      $scope.view=false;

    };

    $scope.$watch('email',function() {
      $scope.success=null;
      $scope.error=null;

    }, true);

    //Admin panel user add
    $scope.addSubmit = function (isValid) {

      if (isValid) {
        var payload = {
          email: $scope.email,
          firstName: $scope.firstName,
          lastName: $scope.lastName,
          phone: $scope.phone,
          country: $scope.country.country_name,
          city: $scope.city.name,
          password: $scope.password
        };

        $scope.confirmPassword = null;
        $scope.password = null;
        $scope.loading=true;

        if($scope.add)
        AuthenticationService.Register(payload, function (result) {
            $scope.loading=false;

            if (result.status!==400) {
              $scope.registerForm.$setPristine(true);
              $scope.firstName=null;
              $scope.lastName=null;
              $scope.phone=null;
              $scope.success="Registration successful!";
              $scope.filter();

            }
            else {
              $scope.error = result.data;
            }
          }
        );
        else {
          payload.id=$scope.id;
          AdminUserService.editUser(payload, function (result) {
            $scope.loading=false;
            if (result.status!==400) {
              $scope.success="User updated successfully successful!"
            }
            else {
              $scope.error = result.data;
            }
          });
        }
      }
    };

    AdminLocationService.getLocationsForSelect(function (response) {
      if(response.status!==400){
        $scope.locations = response.data;

      }
    });

  })

  .directive("ngFileSelect", function(fileReader, $timeout) {
    return {
      scope: {
        ngModel: '='
      },
      link: function(scope, el) {

        function getFile(file) {
          fileReader.readAsDataUrl(file, scope)
            .then(function(result) {
              $timeout(function() {
                scope.$apply(function () {
                  scope.ngModel = result;
                });
              });
            });
        }

        el.bind("change", function(e) {
          var file = (e.srcElement || e.target).files[0];
          getFile(file);
        });
      }
    };
  })

  .factory("fileReader", function($q) {
    var onLoad = function(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.resolve(reader.result);
        });
      };
    };

    var onError = function(reader, deferred, scope) {
      return function() {
        scope.$apply(function() {
          deferred.reject(reader.result);
        });
      };
    };

    var onProgress = function(reader, scope) {
      return function(event) {
        scope.$broadcast("fileProgress", {
          total: event.total,
          loaded: event.loaded
        });
      };
    };

    var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
    };

    var readAsDataURL = function(file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsDataURL(file);

      return deferred.promise;
    };

    return {
      readAsDataUrl: readAsDataURL
    };
  });

