var expect = require('chai').expect;
var request = require('request');

describe('Start script', function() {

    var server;
    var home;

    beforeEach(function() {
        server = require('../start');
        home = 'http://localhost:' + server.port;
    });

    afterEach(function(done) {
        server.stop(function() {
            var name = require.resolve('../start');
            delete require.cache[name];
            done();
        });
    });

    it('starts a server', function(done) {
        request(home + '/index.html', function(err, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});
