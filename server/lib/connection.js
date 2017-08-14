'use strict';

function Connection(io, instance){
    
    class Connection {
        
        // Do these need to be passed in?
        constructor(io, instance){
            console.log('Initializing connections');
            
            var self = this;
            self.io = io;
            self.instance = instance;
            
            self.io.on('connection', self.initializeConnection.bind(self));
        }
        
        initializeConnection(socket){
            var self = this;
            
            console.log(socket.id);
            
            
            socket.on('init', function(message){
                console.log('playerInit', message);
                
                // place player in instance, tell player if successful?
                
                var id = self.instance.playerJoin(socket);
                socket.emit('joined', {ID: id});
                
                
            });
            
            socket.on('disconnect', function(message){
                console.log(socket.id, 'disconnected');
                
                // remove player from instance
                
                self.instance.playerLeave(socket.id);
                
            });
            
            socket.on('tick', function(message){
                // update player's facing
                //console.log(message);
                
                // TODO: Validate these
                var targetX = message.targetX;
                var targetY = message.targetY;
                
                self.instance.playerUpdate(socket.id, targetX, targetY);
            });
            
            socket.on('moveto', function(message){
                var x = message.x;
                var y = message.y;
                
                self.instance.playerMove(socket.id, x, y);
            });
            
        }
        
        
    }
    
    return new Connection(io, instance);
}


module.exports = Connection;