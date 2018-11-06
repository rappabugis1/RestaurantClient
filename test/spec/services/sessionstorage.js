'use strict';

describe('Service: sessionstorage', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var sessionstorage;
  beforeEach(inject(function (_sessionstorage_) {
    sessionstorage = _sessionstorage_;
  }));

  it('should do something', function () {
    expect(!!sessionstorage).toBe(true);
  });

});
