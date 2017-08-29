'use strict';

define(function(require){

    var util = require('./util');

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
            this.size = 30;

            this.delay = 0;

            this.modifiers = [];
            
            // previous values for interpolation
            
            this._x = 0;
            this._y = 0;
            this._angle = 0;
            this._size = 30;
            
            this.init = true;
        }
        
        move(delta){
            // move toward the move target
            // How to take into account collisions?
            
            console.log('deprecated');
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
                size: this.size,
                delay: this.delay,
                
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
                this._size = s.size;
            }
            else{
                // any values that should be interpolated need to be copied here
                
                this._x = this.x;
                this._y = this.y;
                this._angle = this.angle;
                this._size = this.size;
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
            this.size = s.size;
            this.delay = s.delay;
        }
        
    } // End Player


    return Player;
});