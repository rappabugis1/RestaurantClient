'use strict';

describe('Service: admincategories', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var admincategories;
  beforeEach(inject(function (_admincategories_) {
    admincategories = _admincategories_;
  }));

  it('should do something', function () {
    expect(!!admincategories).toBe(true);
  });

});
