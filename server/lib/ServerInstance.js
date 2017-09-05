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
            
            this.prevTick = process.hrtime();
            this.tickRemainder = 0;
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
        setPlayerLook(socketId, targetX, targetY){
            var playerId = this.playerIds[socketId];
            this.instance.setPlayerLook(playerId, targetX, targetY);
        }
        
        setPlayerMove(socketId, x, y){
            var playerId = this.playerIds[socketId];
            this.instance.setPlayerMove(playerId, x, y);
        }
        
        updatePlayer(socketId, inputs){
            var playerId = this.playerIds[socketId];
            var handledId = this.instance.applyInputs(playerId, inputs);
            this.sequenceIds[playerId] = handledId;
        }
        
        ClientUpdate(){
            
            var playerList = [];
            
            for(var id in this.instance.actors){
                var player = this.instance.actors[id];
                playerList.push(player.state);
            }
            
            // broadcast new state to each player
            // TODO: Use AoI to determine what info needs to be sent?
            for(var id in this.instance.actors){
                var actor = this.instance.actors[id];

                if(actor.type === 'player'){
                    var state = this.instance.getState(actor.id, true);
                    this.sockets[actor.id].emit('tick', {state: state, sequenceId: this.sequenceIds[actor.id]});
                }

            }
        }
        
        ServerUpdate(){
            // update player movements, AI actions, health, etc
            
            var newTick = process.hrtime();
            var delta = process.hrtime(this.prevTick);
            delta = delta[0] + delta[1] / 1e9 + this.tickRemainder;

            //console.log(delta, core.timestep);
            //console.log(core.modDelta(delta));
            var fixedDelta = core.modDelta(delta);
            this.tickRemainder = fixedDelta.remainder;
            
            // move each player
            for(var id in this.instance.actors){
                var actor = this.instance.actors[id];
                
                // TODO: use delta
                this.instance.updateActor(actor.id, fixedDelta.delta, true);
                //player.move(delta);
            }

            // update each spell
            // for(var id in this.instance.spells){
            //     var spell = this.instance.spells[id];

            //     this.instance.updateSpell(spell.id, delta);
            // }

            // make each AI act
            
            this.prevTick = newTick;
            
        }
        
    }
    
    return new GameInstance();
}


module.exports = GameInstance;