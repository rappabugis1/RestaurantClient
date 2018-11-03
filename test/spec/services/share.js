'use strict';

describe('Service: share', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var share;
  beforeEach(inject(function (_share_) {
    share = _share_;
  }));

  it('should do something', function () {
    expect(!!share).toBe(true);
  });

});
