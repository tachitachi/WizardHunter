'use strict';

(function(exports){

    console.log('this is core');
    
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
            }
            
            return s;
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
            
            player.x = 200;
            player.y = 200;
            
            this.players[player.id] = player;
            
            return player.id;
            
        }
        
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
            
        }
        
        
    } // End Instance
    
    
    exports.Player = Player;
    exports.Map = Map;
    exports.Instance = Instance;

}(typeof exports === 'undefined' ? this.core = {} : exports));