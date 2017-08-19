'use strict';

var core = require('../../common/core');

var Instance = core.Instance;

// Controls how to communicate between core game code, and network messages
// Updates all players with game state

function GameInstance(){
    
    class GameInstance {
        constructor(){
            console.log('Initializing game instance');
            
            this.instance = new Instance();
            
            this.sockets = {};
            this.playerIds = {};
            
            
            this.clientUpdateInterval = setInterval(this.ClientUpdate.bind(this), 100); // 22 hz
            this.serverUpdateInterval = setInterval(this.ServerUpdate.bind(this), 15); // 66 hz
            
            this.prevTick = +new Date();
        }
        
        
        playerJoin(socket){
            var playerId = this.instance.addPlayer();
            this.sockets[playerId] = socket;
            this.playerIds[socket.id] = playerId;
            return playerId;
        }
        
        playerLeave(id){
            // TODO: finish this
        }
        
        // Handles continuous updates from the player (mouse direction and keypresses?)
        playerUpdate(socketId, targetX, targetY){
            var playerId = this.playerIds[socketId];
            this.instance.playerUpdate(playerId, targetX, targetY);
        }
        
        playerMove(socketId, x, y){
            var playerId = this.playerIds[socketId];
            this.instance.playerMove(playerId, x, y);
        }
        
        
        ClientUpdate(){
            
            var playerList = [];
            
            for(var id in this.instance.players){
                var player = this.instance.players[id];
                playerList.push(player.state);
            }
            
            // broadcast new state to each player
            // TODO: Use AoI to determine what info needs to be sent?
            for(var id in this.instance.players){
                var player = this.instance.players[id];
                this.sockets[player.id].emit('tick', {playerList: playerList});
            }
        }
        
        ServerUpdate(){
            // update player movements, AI actions, health, etc
            
            var newTick = +new Date();
            var delta = (newTick - this.prevTick) / 1000;
            
            // move each player
            for(var id in this.instance.players){
                var player = this.instance.players[id];
                
                // TODO: use delta
                player.move(delta);
            }
            
            this.prevTick = newTick;
            
        }
        
    }
    
    return new GameInstance();
}


module.exports = GameInstance;