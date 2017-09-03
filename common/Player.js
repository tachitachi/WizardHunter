'use strict';

define(function(require){

    var util = require('./util');
    var _ = require('underscore');

    class Player {
        constructor(id){
            console.log('Initializing player');
            this.type = 'player';
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
            
            this.baseSpeed = 300;
            this.moveSpeed = 300;
            this.size = 30;

            this.delay = 0;

            this.effects = [];
            
            // previous values for interpolation
            
            this._x = 0;
            this._y = 0;
            this._angle = 0;
            this._size = 30;
            
            this.init = true;
        }

        destroy(){

        }
        
        update(instance, delta){
            // move toward the move target
            // How to take into account collisions?

            this.moveSpeed = this.baseSpeed;




            if((Math.abs(this.x - this.moveX) < 5) && (Math.abs(this.y - this.moveY) < 5)){
                this.moveX = null;
                this.moveY = null;
            }

            // need to take into account collisions, based on map and entities
            if(this.moveX !== null && this.moveY !== null){
                
                var moveAngle = Math.atan2(this.moveY - this.y, this.moveX - this.x);
                var deltaX = this.moveSpeed * delta * Math.cos(moveAngle);
                var deltaY = this.moveSpeed * delta * Math.sin(moveAngle);

                var otherActors = _.extend({}, instance.actors);
                delete otherActors[this.id];

                var collisionObstacles = _.values(otherActors).concat(_.values(instance.map.obstacles));

                var deltas = util.getRigidCollisions(this, deltaX, deltaY, collisionObstacles);

                //console.log(deltas);
                
                this.x += deltas.x;
                this.y += deltas.y;
                
                this.x = Math.floor(this.x);
                this.y = Math.floor(this.y);
                
                
            }
            
            // calculate new angle
            // y axis is reversed, because down is +y
            // this can be calculated independent of any collisions
            this.angle = Math.atan2(this.y - this.targetY, this.targetX - this.x);
            if(this.angle < 0){
                this.angle += Math.PI * 2;
            }

            this.delay = Math.max(0, this.delay - delta);

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
                type: this.type,
                id: this.id,
                hp: this.hp,
                x: this.x,
                y: this.y,
                angle: this.angle,
                targetX: this.targetX,
                targetY: this.targetY,
                moveX: this.moveX,
                moveY: this.moveY,
                effects: this.effects, // need to iterate and get state?
                baseSpeed: this.baseSpeed,
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
            
            this.type = s.type;
            this.hp = s.hp;
            this.x = s.x;
            this.y = s.y;
            this.angle = s.angle;
            
            this.targetX = s.targetX;
            this.targetY = s.targetY;
            
            this.moveX = s.moveX;
            this.moveY = s.moveY;

            // need to iterate and new?
            this.effects = s.effects;
            
            this.baseSpeed = s.baseSpeed;
            this.moveSpeed = s.moveSpeed;
            this.size = s.size;
            this.delay = s.delay;
        }
        
    } // End Player


    return Player;
});