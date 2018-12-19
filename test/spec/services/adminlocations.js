'use strict';

describe('Service: adminlocations', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var adminlocations;
  beforeEach(inject(function (_adminlocations_) {
    adminlocations = _adminlocations_;
  }));

  it('should do something', function () {
    expect(!!adminlocations).toBe(true);
  });

});
