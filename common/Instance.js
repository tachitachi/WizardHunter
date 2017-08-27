'use strict';


define(function(require){


    var Player = require('./Player');
    var GameMap = require('./GameMap');
    var Inputs = require('./Inputs');
    var Keys = Inputs.Keys;

    class Instance {
        constructor(){
            console.log('Initializing Instance');
            
            this.map = new GameMap();
            
            this.players = {};
            this.enemies = {};
            this.effects = {};
            
            this.nextId = 0;
            
        }

        
        addPlayer(){
            var player = new Player(this.nextId);
            this.nextId += 1;
            
            // TODO: Make sure the player does not spawn in non walkable area
            player.x = Math.floor(Math.random() * this.map.width);
            player.y = Math.floor(Math.random() * this.map.height);
            
            this.players[player.id] = player;
            
            return player.id;
            
        }
        
        removePlayer(playerId){
            delete this.players[playerId];
        }
        
        // This moves instantaneously
        setPlayerLook(id, targetX, targetY){
            if(!this.players.hasOwnProperty(id)){
                // error?
                return;
            }
            
            var player = this.players[id];
            
            if(targetX !== null && targetY !== null){
                player.targetX = targetX;
                player.targetY = targetY;
            }
            
        }
        
        // TODO: add speed to this
        setPlayerMove(id, x, y){
            if(!this.players.hasOwnProperty(id)){
                // error?
                return;
            }
            
            var player = this.players[id];
            
            player.moveX = x;
            player.moveY = y;
        }

        updatePlayer(id, delta){
            var player = this.players[id];
            if(player === undefined){
                return;
            }


            if(player.moveX !== null && player.moveY !== null){
                
                var moveAngle = Math.atan2(player.moveY - player.y, player.moveX - player.x);
                var deltaX = player.moveSpeed * delta * Math.cos(moveAngle);
                var deltaY = player.moveSpeed * delta * Math.sin(moveAngle);
                
                player.x += deltaX;
                player.y += deltaY;
                
                player.x = Math.floor(player.x);
                player.y = Math.floor(player.y);
                
                if((Math.abs(player.x - player.moveX) < 5) && (Math.abs(player.y - player.moveY) < 5)){
                    player.moveX = null;
                    player.moveY = null;
                }
            }
            
            // calculate new angle
            // y axis is reversed, because down is +y
            player.angle = Math.atan2(player.y - player.targetY, player.targetX - player.x);
            if(player.angle < 0){
                player.angle += Math.PI * 2;
            }
        }
        
        applyInputs(playerId, inputs){
            
            var keys = new Keys(inputs.keys);
            var targetX = inputs.targetX;
            var targetY = inputs.targetY;
            
            if(keys.get('lmouse') === 1){
                this.setPlayerMove(playerId, targetX, targetY);
            }
            
            this.setPlayerLook(playerId, targetX, targetY);
            
            return inputs.sequenceId;
        }
        

        getState(playerId, useAoI){
            var s = {};

            // ignore AoI for now

            s.players = this.players;
            s.map = this.map.state;

            return s;
        }

        // add more to this as the state space increases
        copyState(state){

            var remotePlayers = state.players;

            // remove old players
            for(var i in this.players){
                if(!remotePlayers.hasOwnProperty(i)){
                    delete this.players[i];
                }
            }

            // Update and add any new players            
            for(var i in remotePlayers){
                var remotePlayer = remotePlayers[i];
                
                if(!this.players.hasOwnProperty(remotePlayer.id)){
                    console.log('copying unknown player');
                    this.players[remotePlayer.id] = new Player();
                }
                
                var localPlayer = this.players[remotePlayer.id];
                
                
                localPlayer.state = remotePlayer;
            }



            var remoteMap = state.map;
            this.map.state = remoteMap;

            
        }
        
        applyAllInputs(playerId, inputSequence){

            if(inputSequence.length === 0){
                return;
            }
            
            var player = this.players[playerId];
            if(player === undefined){
                return;
            }
            
            for(var i in inputSequence){
                var inputs = inputSequence[i];
                this.applyInputs(playerId, inputs.input);
                
                    
                var delta = inputs.delta / 1000.0;
                
                this.updatePlayer(playerId, delta);
                //console.log(delta);
                
                
                
            }
            
        }
        
        
    } // End Instance

    return Instance;

});