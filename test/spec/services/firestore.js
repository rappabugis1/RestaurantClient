'use strict';

describe('Service: firestore', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var firestore;
  beforeEach(inject(function (_firestore_) {
    firestore = _firestore_;
  }));

  it('should do something', function () {
    expect(!!firestore).toBe(true);
  });

});
