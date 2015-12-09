var Server = require('./app/server/server');

var server = new Server();
server.useDatabase({
    getHelpRequests: function(callback) {
        callback([
            { login:'Joe', data:'this is what Joe shared about himself' },
            { login:'Dana', data:'this is what Dana shared about herself' }
        ]);
    }
});
var port = 5003;
server.start(port, function() {
    console.log('listening on port ' + port);
});

module.exports = server;
module.exports.port = port;
