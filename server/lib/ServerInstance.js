'use strict';

require("amd-loader");
var core = require('../../common/core');
var Inputs = require('../../common/Inputs');

var Instance = core.Instance;
var Keys = Inputs.Keys;

// Controls how to communicate between core game code, and network messages
// Updates all players with game state

function GameInstance(){
    
    class GameInstance {
        constructor(){
            console.log('Initializing game instance');
            
            this.instance = new Instance();
            
            this.sockets = {};
            this.playerIds = {};
            this.sequenceIds = {};
            
            
            this.clientUpdateInterval = setInterval(this.ClientUpdate.bind(this), 45); // 22 hz
            this.serverUpdateInterval = setInterval(this.ServerUpdate.bind(this), 15); // 66 hz
            
            this.prevTick = +new Date();
        }
        
        
        playerJoin(socket){
            var playerId = this.instance.addPlayer();
            this.sockets[playerId] = socket;
            this.playerIds[socket.id] = playerId;
            this.sequenceIds[playerId] = null;
            return playerId;
        }
        
        playerLeave(socket){
            // TODO: finish this
            var playerId = this.playerIds[socket.id];
            this.instance.removePlayer(playerId);
            delete this.sockets[playerId];
            delete this.sequenceIds[playerId];
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
        
        updatePlayer(socketId, inputs){
            var playerId = this.playerIds[socketId];
            var handledId = this.instance.applyInputs(playerId, inputs);
            this.sequenceIds[playerId] = handledId;
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
                this.sockets[player.id].emit('tick', {playerList: playerList, sequenceId: this.sequenceIds[player.id]});
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