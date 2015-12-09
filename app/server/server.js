var express = require('express');
var compression = require('compression');
var morgan = require('morgan');

function Server() {
    this.createHttpRoutes();
    this.useDatabase({
        getHelpRequests: function(callback) {
            callback([]);
        }
    });
};

Server.prototype.useDatabase = function(database) {
    this.database = database;
};

Server.prototype.start = function (port, done) {
    this.http = require('http').createServer(this.application);
    this.http.listen(port, done);
};

Server.prototype.stop = function (done) {
    this.http.close(done);
};

Server.prototype.createHttpRoutes = function () {
    var self = this;
    this.application = express();

    this.application.use(compression());
    this.application.use(require('body-parser').json());
    this.application.use(require('body-parser').urlencoded({ extended: true }));
    this.application.use(express.static(__dirname + '/../client/scripts'));
    this.application.use(express.static(__dirname + '/../client/css'));

    this.application.get('/index.html', function(request, response) {
        var content = require('fs').readFileSync('app/client/pages/index.html').toString();
        self.database.getHelpRequests(function(requests) {
            content = content.replace('id="help-request-count"><', 'id="help-request-count">'+ requests.length +'<');
            response.writeHead(200, {'content-type': 'text/html'});
            response.write(content);
            response.end();
        });
    });
    this.application.get('/help-requests', function(request, response) {
        self.database.getHelpRequests(function(requests) {
            response.writeHead(200, {'content-type': 'application/json'});
            response.write(JSON.stringify(requests));
            response.end();
        });
    });
};

module.exports = Server;
