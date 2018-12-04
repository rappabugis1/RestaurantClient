'use strict';

describe('Service: adminusers', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var adminusers;
  beforeEach(inject(function (_adminusers_) {
    adminusers = _adminusers_;
  }));

  it('should do something', function () {
    expect(!!adminusers).toBe(true);
  });

});
