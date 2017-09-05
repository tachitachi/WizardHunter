'use strict';


define(function(require){


    var Player = require('./Player');
    var GameMap = require('./GameMap');
    var Inputs = require('./Inputs');
    var Keys = Inputs.Keys;
    var util = require('./util');
    var Spell = require('./Spell');
    var Obstacle = require('./Obstacle');
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

        updateActor(id, delta, updateSubActors){
            var actor = this.actors[id];

            actor.update(this, delta, updateSubActors);

            // update all spells owned by actor
            for(var i in this.spells){
                var spell = this.spells[i];
                if(spell.anchor.id === id){
                    this.updateSpell(spell.id, delta, updateSubActors);
                }
            }
        }

        updateSpell(id, delta, updateSubActors){
            var spell = this.spells[id];
            if(spell === undefined){
                return;
            }

            spell.update(this, delta, updateSubActors);

            if(spell.expired){
                spell.destroy();
                delete this.spells[spell.id];
                console.log('removing spell', id);
            }
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

            var actors = {};
            for(var id in this.actors){
                actors[id] = this.actors[id].state;
            }

            var spells = {};
            for(var id in this.spells){
                spells[id] = this.spells[id].state;
            }

            s.nextId = this.nextId;
            s.map = this.map.state;
            s.actors = actors;
            s.spells = spells;

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

                    var actor = undefined;

                    switch(remoteActor.type){
                    case 'player':
                        actor = new Player(remoteActor.id);
                        break;
                    case 'obstacle':
                        actor = new Obstacle(remoteActor.id);
                        break;
                    }

                    if(actor === undefined){
                        console.log('not sure what to do', remoteActor);
                        continue;
                    }

                    this.actors[remoteActor.id] = actor;
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

            // get state beforehand
            var startState = this.getState(playerId, false);
            
            for(var i in inputSequence){
                var inputs = inputSequence[i];
                this.applyInputs(playerId, inputs.input);
                
                    
                var delta = inputs.delta;
                
                //console.log(delta);

                this.updateActor(playerId, delta, false);
                //player.update(this, delta);
                //console.log(delta);
                
                
                
            }

            // get state afterward

//            var endState = this.getState(playerId, false);
//
//            console.log(startState, endState);
//
//            // for each actor, if they are close enough, use the end state to remove jerkiness
//
//            for(var actorId in endState.actors){
//                if(startState.actors.hasOwnProperty(actorId)){
//                    if 
//                }
//            }
            
        }
        
        
    } // End Instance

    return Instance;

});