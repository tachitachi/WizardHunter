'use strict';


define(function(require){


    var util = require('./util');
        
    class Obstacle {
        
        constructor(id){
            console.log('Initializing Obstacle');

            this.id = id;
            this.type = null;
            this.movable = false;
            this.breakable = false;

            this.x = 0;
            this.y = 0;

            this.size = 1;

            this._x = 0;
            this._y = 0;

            this.init = true;
            
        }

        initialize(x, y, options){

            this.x = x;
            this.y = y;
            this._x = x;
            this._y = y;

            if(options.hasOwnProperty('type')){
                this.type = options.type;
            }
            if(options.hasOwnProperty('size')){
                this.size = options.size;
            }
            if(options.hasOwnProperty('movable')){
                this.movable = options.movable;
            }
            if(options.hasOwnProperty('breakable')){
                this.breakable = options.breakable;
            }
        }


        // interpolate the entity between the previous update and the current
        lerp(t){
            var x = util.lerp(this._x, this.x, t);
            var y = util.lerp(this._y, this.y, t);
            //var angle = util.angleLerp(this._angle, this.angle, t);
            
            var s = this.state;
            
            s.x = x;
            s.y = y;
            //s.angle = angle;
            
            return s;
        }


        get state(){
            var s = {
                id: this.id,
                x: this.x,
                y: this.y,
                type: this.type,
                size: this.size,
                movable: this.movable,
                breakable: this.breakable,
            }
            
            return s;
        }
        
        set state(s){
            
            // Do not interpolate if this unit was newly created
            if(this.init){
                this.init = false;
                this._x = s.x;
                this._y = s.y;
            }
            else{
                // any values that should be interpolated need to be copied here
                
                this._x = this.x;
                this._y = this.y;
            }
            
            this.x = s.x;
            this.y = s.y;
            this.type = s.type;
            this.size = s.size;
            this.movable = s.movable;
            this.breakable = s.breakable;
        }
        
        
    }


    return Obstacle;
});