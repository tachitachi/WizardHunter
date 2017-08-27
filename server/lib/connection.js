'use strict';

// Interface between Client and Server
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
                socket.emit('joined', {id: id});
                
                
            });
            
            socket.on('disconnect', function(message){
                console.log(socket.id, 'disconnected');
                
                // remove player from instance
                
                self.instance.playerLeave(socket);
                
            });
            
            socket.on('input', function(inputs){
                setTimeout(function(){
                    self.instance.updatePlayer(socket.id, inputs);
                }, 1000);
            });
            
        }
        
        
    }
    
    return new Connection(io, instance);
}


module.exports = Connection;