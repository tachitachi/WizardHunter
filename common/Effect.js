'use strict';


define(function(require){

    class Effect {
        
        constructor(id, effectId){
            console.log('Initializing Effect');
            this.type = 'effect';

            this.id = id;
            this.effectId = effectId;
            
            // time since starting
            this.time = 0;

            // time until effect ends
            this.duration = 0;

            this.x = 0;
            this.y = 0;

            this._x = 0;
            this._y = 0;

            this.init = true;

            this.initialize();
            
        }

        initialize(){
            if(this.effectId === 0){
                // slow movement speed
            }
        }

        destroy(){

        }

        update(instance, delta){
            this.time += delta;
        }

        apply(target){

        }

        get state(){
            var s = {
                type: this.type,
                id: this.id,
                effectId: this.effectId,
                time: this.time,
                duration: this.duration,
                x: this.x,
                y: this.y,
            };

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
            
            this.type = s.type;
            this.id = s.id;
            this.effectId = s.effectId;
            this.time = s.time;
            this.duration = s.duration;
            this.x = s.x;
            this.y = s.y;
        }
        
    }

    return Effect;
});