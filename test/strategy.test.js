/* global describe, it, expect */
/* jshint expr: true */

var BrightspaceStrategy = require('../lib/strategy');


describe('Strategy', function() {

  var strategy = new BrightspaceStrategy({
      clientID: 'ABC123',
      clientSecret: 'brightspace'
    },
    function() {});

  it('should be named brightspace', function() {
    expect(strategy.name).to.equal('brightspace');
  });

});
