'use strict';

describe('Controller: ReservationCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ReservationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReservationCtrl = $controller('ReservationController', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReservationCtrl.awesomeThings.length).toBe(3);
  });
});
