'use strict';

describe('Controller: MyreservationsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var MyreservationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyreservationsCtrl = $controller('MyreservationsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MyreservationsCtrl.awesomeThings.length).toBe(3);
  });
});
