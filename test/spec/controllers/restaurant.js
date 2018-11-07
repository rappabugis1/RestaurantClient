'use strict';

describe('Controller: RestaurantCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var RestaurantCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RestaurantCtrl = $controller('RestaurantController', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RestaurantCtrl.awesomeThings.length).toBe(3);
  });
});
