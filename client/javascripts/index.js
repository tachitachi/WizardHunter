requirejs.config({
    baseUrl: '/',
    paths: {
        socketio: '../socket.io/socket.io',
        underscore: 'client/javascripts/lib/underscore.min',
    }
});

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };
}

require(['client/javascripts/main']);