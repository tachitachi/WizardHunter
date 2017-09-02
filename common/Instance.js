'use strict';


define(function(require){


    var Player = require('./Player');
    var GameMap = require('./GameMap');
    var Inputs = require('./Inputs');
    var Keys = Inputs.Keys;
    var util = require('./util');
    var Spell = require('./Spell');
    var _ = require('underscore');

    class Instance {
        constructor(){
            console.log('Initializing Instance');
            
            this.map = new GameMap();
            this.actors = {};
            this.spells = {};
            
            this.nextId = 0;
            
        }

        getNextId(){
            return this.nextId++;
        }

        setNextId(id){
            this.nextId = id;
        }

        addPlayer(){
            var player = new Player(this.getNextId());
            
            // TODO: Make sure the player does not spawn in non walkable area
            player.x = Math.floor(Math.random() * this.map.width);
            player.y = Math.floor(Math.random() * this.map.height);
            
            this.actors[player.id] = player;
            
            return player.id;
            
        }
        
        removePlayer(playerId){
            delete this.actors[playerId];
        }
        
        // This moves instantaneously
        setPlayerLook(id, targetX, targetY){
            if(!this.actors.hasOwnProperty(id)){
                // error?
                return;
            }
            
            var player = this.actors[id];
            
            if(targetX !== null && targetY !== null){
                player.targetX = targetX;
                player.targetY = targetY;
            }
            
        }
        
        // TODO: add speed to this
        setPlayerMove(id, x, y){
            if(!this.actors.hasOwnProperty(id)){
                // error?
                return;
            }
            
            var player = this.actors[id];
            
            player.moveX = x;
            player.moveY = y;
        }

        updateActor(id, delta){
            var actor = this.actors[id];

            switch(actor.type){
            case 'player':
                this.updatePlayer(id, delta);

                break;
            default:
                // unknown type?
                break;
            }
        }

        updatePlayer(id, delta){
            var player = this.actors[id];
            if(player === undefined){
                return;
            }

            if((Math.abs(player.x - player.moveX) < 5) && (Math.abs(player.y - player.moveY) < 5)){
                player.moveX = null;
                player.moveY = null;
            }

            // need to take into account collisions, based on map and entities
            if(player.moveX !== null && player.moveY !== null){
                
                var moveAngle = Math.atan2(player.moveY - player.y, player.moveX - player.x);
                var deltaX = player.moveSpeed * delta * Math.cos(moveAngle);
                var deltaY = player.moveSpeed * delta * Math.sin(moveAngle);

                var otherPlayers = _.extend({}, this.actors);
                delete otherPlayers[id];

                var collisionObstacles = _.values(otherPlayers).concat(_.values(this.map.obstacles));

                var deltas = util.getRigidCollisions(player, deltaX, deltaY, collisionObstacles);
                
                player.x += deltas.x;
                player.y += deltas.y;
                
                player.x = Math.floor(player.x);
                player.y = Math.floor(player.y);
                
                
            }
            
            // calculate new angle
            // y axis is reversed, because down is +y
            // this can be calculated independent of any collisions
            player.angle = Math.atan2(player.y - player.targetY, player.targetX - player.x);
            if(player.angle < 0){
                player.angle += Math.PI * 2;
            }

            player.delay = Math.max(0, player.delay - delta);
        }

        updateSpell(id, delta){
            var spell = this.spells[id];
            if(spell === undefined){
                return;
            }

            spell.update(delta);
        }
        
        applyInputs(playerId, inputs){

            var player = this.actors[playerId];
            
            var keys = new Keys(inputs.keys);
            var targetX = inputs.targetX;
            var targetY = inputs.targetY;
            
            if(keys.get('lmouse') === 1){
                this.setPlayerMove(playerId, targetX, targetY);
            }
            
            this.setPlayerLook(playerId, targetX, targetY);


            if(keys.get('d') === 1){

                if(player.delay === 0){
                    var rockWall = new Spell(this.getNextId(), 0, player);

                    this.spells[rockWall.id] = rockWall;

                    player.delay = rockWall.delay;
                }
            }
            
            return inputs.sequenceId;
        }
        

        getState(playerId, useAoI){
            var s = {};

            // ignore AoI for now

            s.nextId = this.nextId;
            s.actors = this.actors;
            s.map = this.map.state;
            s.spells = this.spells;

            return s;
        }

        // add more to this as the state space increases
        copyState(state){

            this.nextId = state.nextId;
            var remoteActors = state.actors;
            var remoteSpells = state.spells;

            // remove old players
            for(var i in this.actors){
                if(!remoteActors.hasOwnProperty(i)){
                    delete this.actors[i];
                }
            }

            // Update and add any new actors            
            for(var i in remoteActors){
                var remoteActor = remoteActors[i];
                
                if(!this.actors.hasOwnProperty(remoteActor.id)){
                    this.actors[remoteActor.id] = new Player();
                }
                
                var localActor = this.actors[remoteActor.id];
                
                
                localActor.state = remoteActor;
            }



            // remove old spells
            for(var i in this.spells){
                if(!remoteSpells.hasOwnProperty(i)){
                    delete this.spells[i];
                }
            }

            // Update and add any new spells            
            for(var i in remoteSpells){
                var remoteSpell = remoteSpells[i];
                //console.log(remoteSpell.anchor);
                
                //console.log(this.spells);

                if(!this.spells.hasOwnProperty(remoteSpell.id)){
                    this.spells[remoteSpell.id] = new Spell(remoteSpell.id, remoteSpell.spellId, remoteSpell.anchor);
                }
                
                var localSpell = this.spells[remoteSpell.id];
                
                
                localSpell.state = remoteSpell;
            }



            var remoteMap = state.map;
            this.map.state = remoteMap;

            
        }
        
        applyAllInputs(playerId, inputSequence){

            if(inputSequence.length === 0){
                return;
            }
            
            var player = this.actors[playerId];
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