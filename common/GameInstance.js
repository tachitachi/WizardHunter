'use strict';

var Player = require('./Player');
var Creature = require('./Creature');
var Effect = require('./Effect');
var Map = require('./Map');

function GameInstance(){
    
    class GameInstance {
        constructor(){
            console.log('Initializing game instance');
            
            var self = this;
            
            self.map = Map();
            
            self.players = {};
            self.enemies = {};
            self.effects = {};
            
            
            self.clientUpdateInterval = setInterval(self.ClientUpdate.bind(self), 100); // 22 hz
            self.serverUpdateInterval = setInterval(self.ServerUpdate.bind(self), 15); // 66 hz
            
            self.nextId = 0;
            self.prevTick = (new Date()).getTime();
        }
        
        
        playerJoin(socket){
            var self = this;
            var player = Player(self.nextId, socket);
            self.nextId += 1;
            
            
            //player.x = Math.floor(Math.random() * self.map.width);
            //player.y = Math.floor(Math.random() * self.map.height);
            
            player.x = 200;
            player.y = 200;
            
            
            self.players[socket.id] = player;
            
            return player.id;
            
        }
        
        playerLeave(id){
            var self = this;
            delete self.players[id];
        }
        
        // Handles continuous updates from the player (mouse direction and keypresses?)
        playerUpdate(id, targetX, targetY){
            var self = this;
            if(!self.players.hasOwnProperty(id)){
                // error?
                return;
            }
            
            var player = self.players[id];
            
            if(targetX !== null && targetY !== null){
                player.targetX = targetX;
                player.targetY = targetY;
            }
            
        }
        
        playerMove(id, x, y){
            var self = this;
            
            if(!self.players.hasOwnProperty(id)){
                // error?
                return;
            }
            
            var player = self.players[id];
            
            player.moveX = x;
            player.moveY = y;
        }
        
        
        ClientUpdate(){
            var self = this;
            
            var playerList = [];
            
            for(var id in self.players){
                var player = self.players[id];
                playerList.push(player.state);
            }
            
            // broadcast new state to each player
            // TODO: Use AoI to determine what info needs to be sent?
            for(var id in self.players){
                var player = self.players[id];
                player.socket.emit('tick', {playerList: playerList});
            }
        }
        
        ServerUpdate(){
            var self = this;
            // update player movements, AI actions, health, etc
            
            var newTick = (new Date()).getTime();
            var delta = (newTick - self.prevTick) / 1000;
            
            // move each player
            for(var id in self.players){
                var player = self.players[id];
                
                // TODO: use delta
                player.move(delta);
            }
            
            self.prevTick = newTick;
            
        }
        
    }
    
    return new GameInstance();
}


module.exports = GameInstance;