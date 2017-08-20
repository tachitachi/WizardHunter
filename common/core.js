'use strict';

(function(exports){

    console.log('this is core');

    if(typeof module !== 'undefined' && module.exports){
        // running in node
        var nodeInputs = require('./Inputs');
        var Keys = nodeInputs.Keys;
    }
    else{
        // running in browser
        var Keys;
        
        // TODO: Find a better fix for this. Potentially a race condition
        require(['common/Inputs'], function(){
            Keys = Inputs.Keys;
        
        });
    }
    
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
        }
        
        move(delta){
            // move toward the move target
            if(this.moveX !== null && this.moveY !== null){
                
                var moveAngle = Math.atan2(this.moveY - this.y, this.moveX - this.x);
                var deltaX = this.moveSpeed * delta * Math.cos(moveAngle);
                var deltaY = this.moveSpeed * delta * Math.sin(moveAngle);
                
                this.x += deltaX;
                this.y += deltaY;
                
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
        
        get state(){
            var s = {
                ID: this.id,
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
            
            this.width = 5000;
            this.height = 5000;
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
            
            
            //player.x = Math.floor(Math.random() * this.map.width);
            //player.y = Math.floor(Math.random() * this.map.height);
            
            player.x = 400;
            player.y = 200;
            
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
        
        // add more to this as the state space increases
        copyState(playerList){
            
            for(var i in playerList){
                var remotePlayer = playerList[i];
                
                if(!this.players.hasOwnProperty(remotePlayer.ID)){
                    console.log('copying unknown player');
                    this.players[remotePlayer.ID] = new Player();
                }
                
                var localPlayer = this.players[remotePlayer.ID];
                
                //console.log(localPlayer.angle);
                localPlayer.state = remotePlayer;
                
                //console.log(localPlayer.angle);
                
                //localPlayer.hp = remotePlayer.hp;
                //localPlayer.x = remotePlayer.x;
                //localPlayer.y = remotePlayer.y;
                //localPlayer.angle = remotePlayer.angle;
            }
            
        }
        
        applyAllInputs(playerId, prevTimestamp, inputSequence){
            
            if(inputSequence.length === 0){
                return;
            }
            
            if(prevTimestamp === null){
                prevTimestamp = inputSequence[0].timestamp;
            }
            
            var player = this.players[playerId];
            
            var prevX = player.x;
            var prevY = player.y;
                
            //console.log('prev', prevTimestamp);
            //console.log('applying', inputSequence.length, 'inputs');
            
            var prev = prevTimestamp;
            for(var i in inputSequence){
                var inputs = inputSequence[i];
                var delta = (inputs.timestamp - prev) / 1000.0;
                
                this.applyInputs(playerId, inputs.input);
                player.move(delta);
                
                //console.log(player.x, player.y, inputs.input.keys[0], inputs.input.targetX, inputs.input.targetY);
                
                //console.log(inputs.input, delta);
                
                prev = inputs.timestamp;
            }
            
            
            //console.log(player);
        }
        
        
    } // End Instance
    
    
    exports.Player = Player;
    exports.Map = Map;
    exports.Instance = Instance;

}(typeof exports === 'undefined' ? this.core = {} : exports));