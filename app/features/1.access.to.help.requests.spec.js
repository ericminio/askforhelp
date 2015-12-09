var Zombie = require('zombie');
var get = require('request');
var expect = require('chai').expect;

describe('help requests', function() {

    var port = 5000;
    var url = 'http://localhost:' + port;
    var Server = require('../server/server');
    var requests = [
        { id:25, login:'Joe', data:'this is what Joe shared about himself' },
        { id:12, login:'Dana', data:'this is what Dana shared about herself' }
    ];

    beforeEach(function(done) {
        server = new Server();
        server.useDatabase({
            getHelpRequests: function(callback) { callback(requests); }
        });
        server.start(port, done);
    });

    afterEach(function(done) {
        server.stop(done);
    });

    describe('api access', function() {

        var response;
        var body;

        beforeEach(function(done) {
            get(url + '/help-requests', function(error, r, b) {
                response = r;
                body = b;
                done();
            });
        });

        it('is available', function() {
            expect(response.statusCode).to.equal(200);
        });

        it('returns json', function() {
            expect(response.headers['content-type']).to.equal('application/json');
        });

        it('returns known requests', function() {
            expect(body).to.equal(JSON.stringify(requests));
        });
    });

    describe('web page display', function() {

        it('is available', function(done) {
            const browser = new Zombie();

            browser.visit(url + '/index.html')
                .then(function() {
                    browser.assert.text('#help-request-count', '2');
                })
                .then(function() {
                    browser.assert.elements('#help-requests .help-request', 2);
                })
                .then(function() {
                    browser.assert.element('#help-request-25');
                    browser.assert.element('#help-request-12');
                })
                .then(function() {
                    expect(browser.document.querySelector('#help-request-12').innerHTML).to.contain('Dana');
                })
                .then(function() {
                    expect(browser.document.querySelector('#help-request-12').innerHTML).to.contain('this is what Dana shared about herself');
                })
                .then(done, done);
        });
    });
});
