'use strict';

define(function(require){

    console.log('this is core2');

    var Inputs = require('./Inputs');
    var util = require('./util');
    var Obstacle = require('./Obstacle');
    
    
    var Keys = Inputs.Keys;
    
    // core should take care of the core game logic
    // there should be nothing here about how network messages are sent, how often, interpolation, lag mitigation, etc
    
    
    class Player {
        constructor(id){
            console.log('Initializing player');
            this.id = id;
            
            // keep track of internal variables like health, animation time, etc
            this.hp = 1000;
            this.x = 0;
            this.y = 0;
            this.angle = 0;
            
            this.targetX = 0;
            this.targetY = 0;
            
            this.moveX = null;
            this.moveY = null;
            
            this.moveSpeed = 300;
            
            // previous values for interpolation
            
            this._x = 0;
            this._y = 0;
            this._angle = 0;
            
            this.init = true;
        }
        
        move(delta){
            // move toward the move target
            
            if(this.moveX !== null && this.moveY !== null){
                
                var moveAngle = Math.atan2(this.moveY - this.y, this.moveX - this.x);
                var deltaX = this.moveSpeed * delta * Math.cos(moveAngle);
                var deltaY = this.moveSpeed * delta * Math.sin(moveAngle);
                
                this.x += deltaX;
                this.y += deltaY;
                
                this.x = Math.floor(this.x);
                this.y = Math.floor(this.y);
                
                if((Math.abs(this.x - this.moveX) < 5) && (Math.abs(this.y - this.moveY) < 5)){
                    this.moveX = null;
                    this.moveY = null;
                }
            }
            
            // calculate new angle
            // y axis is reversed, because down is +y
            this.angle = Math.atan2(this.y - this.targetY, this.targetX - this.x);
            if(this.angle < 0){
                this.angle += Math.PI * 2;
            }
        }
        
        // interpolate the entity between the previous update and the current
        lerp(t){
            var x = util.lerp(this._x, this.x, t);
            var y = util.lerp(this._y, this.y, t);
            var angle = util.angleLerp(this._angle, this.angle, t);
            
            var s = this.state;
            
            s.x = x;
            s.y = y;
            s.angle = angle;
            
            return s;
        }
        
        get state(){
            var s = {
                id: this.id,
                hp: this.hp,
                x: this.x,
                y: this.y,
                angle: this.angle,
                targetX: this.targetX,
                targetY: this.targetY,
                moveX: this.moveX,
                moveY: this.moveY,
                moveSpeed: this.moveSpeed,
                
            }
            
            return s;
        }
        
        set state(s){
            
            // Do not interpolate if this unit was newly created
            if(this.init){
                this.init = false;
                this._x = s.x;
                this._y = s.y;
                this._angle = s.angle;
            }
            else{
                // any values that should be interpolated need to be copied here
                
                this._x = this.x;
                this._y = this.y;
                this._angle = this.angle;
            }
            
            this.hp = s.hp;
            this.x = s.x;
            this.y = s.y;
            this.angle = s.angle;
            
            this.targetX = s.targetX;
            this.targetY = s.targetY;
            
            this.moveX = s.moveX;
            this.moveY = s.moveY;
            
            this.moveSpeed = s.moveSpeed;
        }
        
    } // End Player
    
    
    class Map {
        constructor(){
            console.log('Initializing Map');
            // keep track of internal variables like health, animation time, etc
            
            this.width = 1000;
            this.height = 700;

            this.obstacles = {};

            // randomly add obstacles
            for(var i = 0; i < 5; i++){
                var x = Math.floor(Math.random() * this.width);
                var y = Math.floor(Math.random() * this.height);
                var obstacle = new Obstacle(i);

                obstacle.initialize(x, y, {type: 0, size: Math.random() * 15 + 5, movable: false, breakable: false})

                this.obstacles[i] = obstacle;
            }
        }



        get state(){
            var state = {obstacles: this.obstacles};
            return state;
        }

        set state(state){
            for(var i in this.obstacles){
                if(!state.obstacles.hasOwnProperty(i)){
                    delete this.obstacles[i];
                }
            }

            for(var i in state.obstacles){
                var remoteObstacle = state.obstacles[i];
                if(!this.obstacles.hasOwnProperty(i)){
                    this.obstacles[i] = new Obstacle(remoteObstacle.id);
                    this.obstacles[i].initialize(remoteObstacle.x, remoteObstacle.y);
                }

                this.obstacles[i].state = remoteObstacle;
            }

        }
    } // End Map

    
    class Instance {
        constructor(){
            console.log('Initializing Instance');
            
            this.map = new Map();
            
            this.players = {};
            this.enemies = {};
            this.effects = {};
            
            this.nextId = 0;
            
        }

        
        addPlayer(){
            var player = new Player(this.nextId);
            this.nextId += 1;
            
            
            player.x = Math.floor(Math.random() * this.map.width);
            player.y = Math.floor(Math.random() * this.map.height);
            
            //player.x = 400;
            //player.y = 200;
            
            this.players[player.id] = player;
            
            return player.id;
            
        }
        
        removePlayer(playerId){
            delete this.players[playerId];
        }
        
        // This moves instantaneously
        playerUpdate(id, targetX, targetY){
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
        playerMove(id, x, y){
            if(!this.players.hasOwnProperty(id)){
                // error?
                return;
            }
            
            var player = this.players[id];
            
            player.moveX = x;
            player.moveY = y;
        }
        
        applyInputs(playerId, inputs){
            
            var keys = new Keys(inputs.keys);
            var targetX = inputs.targetX;
            var targetY = inputs.targetY;
            
            if(keys.get('lmouse') === 1){
                this.playerMove(playerId, targetX, targetY);
            }
            
            this.playerUpdate(playerId, targetX, targetY);
            
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
                
                player.move(delta);
                //console.log(delta);
                
                
                
            }
            
        }
        
        
    } // End Instance
    
    
    //exports.Player = Player;
    //exports.Map = Map;
    //exports.Instance = Instance;
    
    return {Player: Player, Map: Map, Instance: Instance};

});