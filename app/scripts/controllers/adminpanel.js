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

  .controller('AdminRestaurantManipulationController', function ($scope,$route, FilterFactoryServis,$log, $window, fileReader, AdminLocationService, AdminCategoryService, FirestoreService, RestaurantService)  {

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

    $scope.deleteRestaurant = function(restaurant){
      RestaurantService.deleteRestaurant({id:restaurant.id}, function () {
        $scope.filter();
      });
    };

    $scope.view = false;

    // change view false shows table, true shows edit
    $scope.changeView= function(changeType, restaurant){
      $scope.view = true;
      $scope.add=false;
      $scope.edit=false;

      if(changeType==='Edit') {
        $scope.edit = true;

        //Get restaurant data
        RestaurantService.getAdminDetails({id: restaurant.id}, function (response) {

          //update google maps
          $scope.marker.coordinates.longitude = response.data.basicDetails.longitude;
          $scope.marker.coordinates.latitude=response.data.basicDetails.latitude;
          $scope.map.center.latitude=response.data.basicDetails.latitude;
          $scope.map.center.longitude=response.data.basicDetails.longitude;

          //update basic info
          rest.restaurantName = response.data.basicDetails.restaurantName;
          rest.priceRange = $scope.priceRanges[response.data.basicDetails.priceRange-1];
          rest.resDescription =response.data.basicDetails.description;

          $scope.locations.forEach(function (country) {
            country.city_names.forEach(function(city){
              if(city.name===response.data.location){
                $scope.country=country;
                rest.city=city;
              }
            })
          });

          response.data.categories.forEach(function(val){
            $scope.pickedCategories.push(val.name);
            $scope.pickedCatPayload.push(val.id);
          });

          rest.defaultLength =response.data.basicDetails.defaultStay;
          rest.imageLogoSrc= response.data.basicDetails.imageFileName;
          rest.imageCoverSrc=response.data.basicDetails.coverFileName;

          //update dishes
          $scope.dishes.dishesList= response.data.dishes;

          //update tables
          rest.tables.newTables=[];

          response.data.tablesNumbers.forEach(function (element) {
            var type =rest.tables.findTableType(element.tableType);

            rest.tables.newTables.push({tableType: type, amount: element.amount, original:element.amount});
            rest.tables.changeDisabled(type, true);

          });

          //update reservation lengths

          response.data.lengths.forEach(function (len) {
            $scope.reservations.addExistingLength(len);
          });

        });

      }
      else
        $scope.add=true;
    };

    $scope.cancel=function(){
      $scope.view=false;
      rest.tables=new Tables();
      $scope.dishes= new Dishes();
      $scope.reservations=new Reservations();
      rest.restaurantName = null;
      rest.priceRange = null;
      rest.resDescription =null;
      $scope.country=null;
      rest.city=null;
      $scope.pickedCategories=[];
      $scope.pickedCatPayload=[];

      rest.defaultLength =null;
      rest.imageLogoSrc= null;
      rest.imageCoverSrc=null;
      $scope.restaurantForm.$setPristine();
      $scope.submited=false;

    };

    //Price Range
    $scope.priceRanges = ['Low', 'Lower Medium', 'Medium', 'Upper Medium', 'High'];

    //Locations

    AdminLocationService.getLocationsForSelect(function (response) {
      if(response.status!==400){
        $scope.locations = response.data;

      }
    });

    //Categories

    AdminCategoryService.getAllCategories(function (response) {
      if(response.status!==400){
        $scope.categories = response.data;
      }
    });

    $scope.pickedCatPayload=[];

    $scope.pickedCategories= [];



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

    //Images

    //imagesurl
    $scope.imageLogoUrl = "";
    $scope.imageCoverUrl = "";

    rest.imageLogoSrc="";
    rest.imageCoverSrc="";


    //Tables

    function Tables(){

      this.tablesPayload = {
        addQueue: [],
        editQueue: [],
        deleteQueue: [],
        restaurantId: ""
      };

      this.newTables = [];

      this.tablesList=
        [ {id: 'Select type of tables', label: 'Select type of tables' , numberGuests: 0,disabled : true},
          { id: 'Tables for one', label: 'Tables for one', numberGuests: 1 },
          { id: 'Tables for two', label: 'Tables for two', numberGuests: 2 },
          { id: 'Tables for three', label: 'Tables for three', numberGuests: 3},
          { id: 'Tables for four', label: 'Tables for four', numberGuests: 4},
          { id: 'Tables for five', label: 'Tables for five', numberGuests: 5},
          { id: 'Tables for six', label: 'Tables for six', numberGuests: 6},
          { id: 'Tables for seven', label: 'Tables for seven', numberGuests: 7},
          { id: 'Tables for eight', label: 'Tables for eight', numberGuests: 8},
          { id: 'Tables for nine', label: 'Tables for nine', numberGuests: 9},
          { id: 'Tables for ten', label: 'Tables for ten', numberGuests: 10}];

      this.addNewTables = function () {
        this.newTables.push({tableType: this.tablesList[0].label, amount: ""});
      };

      this.removeTables = function(index) {

        this.changeDisabled( this.newTables[index].tableType, false);
        this.newTables.splice(index,1);

      };

      this.findTableType=function (number) {
        var label;
        this.tablesList.forEach(function (element) {
          if(element.numberGuests===number)
            label=element.label
        });
        return label;
      };

      this.typeChanged= function(newtype, oldtype) {
        this.changeDisabled(newtype, true);
        this.changeDisabled(oldtype, false);
      };

      this.changeDisabled= function(type, toDisabled){
        this.typeIndex=0;

        if(type && type!=='Select type of tables'){
          this.tablesList.forEach(function (element, index) {
            if(element.label===type)
              this.typeIndex=index;
          }, this);

          this.tablesList[this.typeIndex].disabled=toDisabled;
        }
      };

    }

    rest.tables= new Tables();

    //add three place holders tables
    rest.tables.addNewTables();
    rest.tables.addNewTables();
    rest.tables.addNewTables();

    //Tables End


    //Dishes

    function Dishes() {

      this.dishesPayload = {
        addQueue: [],
        editQueue: [],
        deleteQueue: [],
        restaurantId: ""
      };

      this.dishesList=[];


      this.addNewDish = function (menuType) {
        this.dishesList.push({name: "", description: "", price: "", dishType: "", menuType: menuType})
      };

      this.removeDish = function(index) {

        //If deleted dish has an id, put it in delete queue
        if(this.dishesList[index].id)
          this.dishesPayload.deleteQueue.push(this.dishesList[index].id);

        this.dishesList.splice(index,1);
      };

      this.editDish = function(index){
        //if dish has id and not in queue, put it in edit queue
        if(this.dishesList[index].id && this.dishesPayload.editQueue.indexOf(this.dishesList[index]))
          this.dishesPayload.editQueue.push(this.dishesList[index]);
      };
    }

    $scope.dishes= new Dishes();

    RestaurantService.getDishTypes(function (response) {
      $scope.dishTypes= response.data;
    });

    $scope.radioModel = 'Breakfast';

    //Add three placeholder dishes
    $scope.dishes.addNewDish('Breakfast');
    $scope.dishes.addNewDish('Breakfast');
    $scope.dishes.addNewDish('Breakfast');

    //Dishes End

    //Reservations

    //constructor for reservations length object controller
    function Reservations() {

      this.lengths= [ {id: 'Select number of Guests', label: 'Select number of Guests' , numberGuests: 0,disabled : true},
                      { id: 'One person', label: 'One person', numberGuests: 1 },
                      { id: 'Two people', label: 'Two people', numberGuests: 2 },
                      { id: 'Three people', label: 'Three people', numberGuests: 3 },
                      { id: 'Four people', label: 'Four people', numberGuests: 4},
                      { id: 'Five people', label: 'Five people', numberGuests: 5},
                      { id: 'Six people', label: 'Six people', numberGuests: 6},
                      { id: 'Seven people', label: 'Seven people', numberGuests: 7},
                      { id: 'Eight people', label: 'Eight people', numberGuests: 8},
                      { id: 'Nine people', label: 'Nine people', numberGuests: 9},
                      { id: 'Ten people', label: 'Ten people', numberGuests: 10}];

      this.pickedLengths = [];

      this.reservationLengthsPayload= {
        addQueue: [],
        editQueue: [],
        deleteQueue: [],
        restaurantId: ""
      };

      this.addLength = function () {
          this.pickedLengths.push({label: this.lengths[0].label, guestNumber: this.lengths[0].numberGuests, workday: {morning: "", day: "", evening: ""},  weekend: {morning: "", day: "", evening: ""}});
        };

      this.addExistingLength = function (length) {
        this.pickedLengths.push({id:length.id, label: this.lengths[length.guestNumber].label, guestNumber: length.guestNumber, workday:{morning:length.stayByDays[0].morning, day:length.stayByDays[0].day, evening: length.stayByDays[0].evening}, weekend: {morning:length.stayByDays[1].morning, day:length.stayByDays[1].day, evening: length.stayByDays[1].evening}})
        this.changeDisabledLength(this.lengths[length.guestNumber],true);
      };

      this.removeLength = function (index) {
          //Add id to delete que
          if(this.pickedLengths[index].id){
            this.reservationLengthsPayload.deleteQueue.push(this.pickedLengths[index].id);
          }

          this.changeDisabledLength(this.pickedLengths[index].label, false);

          this.pickedLengths.splice(index, 1);
        };

      this.changeNumber = function(value){

          this.lengths.forEach(function (len) {
            if(len.label===value.label)
              this.pickedLengths[this.pickedLengths.indexOf(value)].guestNumber=len.numberGuests;
          }, this);
        };

      this.lengthChanged =  function(newtype, oldtype) {
          this.changeDisabledLength(newtype, true);
          this.changeDisabledLength(oldtype, false);
        };

      this.changeDisabledLength =  function(type, toDisabled){
          this.lengthIndex =0;

          if(type && type!=='Select number of Guests'){
            this.lengths.forEach(function (element, index) {
              if(element.label===type)
                this.lengthIndex=index;
            }, this);

            this.lengths[this.lengthIndex].disabled=toDisabled;
          }
        }
      }

    $scope.reservations = new Reservations();



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
              defaultStay: rest.defaultLength
            };

            //then => save rest
            RestaurantService.adminAddRestaurant($scope.basicInfoPayload, function (response) {
              $scope.progress=60;
              $scope.currentTask="Adding menu...";

              //Add NEW dishes to payload
              $scope.dishes.dishesList.forEach(function (value) {
                $scope.dishes.dishesPayload.addQueue.push(value);
              });

              $scope.dishes.dishesPayload.restaurantId=response.data.id;

              //then => save menu
              RestaurantService.restaurantMenuItems($scope.dishes.dishesPayload, function () {

                $scope.progress=70;
                $scope.currentTask="Adding tables...";

                rest.tables.newTables.forEach(function (value) {
                  rest.tables.tablesList.forEach(function (tableInfo) {
                    if(tableInfo.label===value.tableType)
                      rest.tables.tablesPayload.addQueue.push({tableType: tableInfo.numberGuests, amount: value.amount});
                  });
                });

                rest.tables.tablesPayload.restaurantId=$scope.dishes.dishesPayload.restaurantId;

                RestaurantService.restaurantTables(rest.tables.tablesPayload, function () {

                  $scope.progress=80;
                  $scope.currentTask="Adding reservation lengths...";

                  $scope.reservations.pickedLengths.forEach(function (groupLength) {
                    if(!groupLength.index)
                      $scope.reservations.reservationLengthsPayload.addQueue.push(groupLength);
                  });

                  $scope.reservations.reservationLengthsPayload.restaurantId=$scope.dishes.dishesPayload.restaurantId;

                  RestaurantService.restaurantReservationLengths($scope.reservations.reservationLengthsPayload, function () {
                    $scope.progress=100;
                    $scope.currentTask="Finalising...";
                    $scope.success="Restaurant saved successfully.";
                  });
                });

              });

            });

          });

        });

      }

    };




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

    $scope.deleteLocation= function(location) {
      AdminLocationService.deleteLocation({id : location.id}, function (response) {
        $scope.filter();
      });
    };

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

    $scope.deleteCategory= function(category){
      AdminCategoryService.deleteCategory({id: category.id}, function (reponse) {
        $scope.filter();
      });
    };

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

    //Delete user

    $scope.deleteUser = function(user){
      AdminUserService.deleteUser({id : user.id}, function (response) {
        $scope.filter();
      });
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

