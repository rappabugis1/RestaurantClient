'use strict';

describe('Service: reservation', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var reservation;
  beforeEach(inject(function (_reservation_) {
    reservation = _reservation_;
  }));

  it('should do something', function () {
    expect(!!reservation).toBe(true);
  });

});
