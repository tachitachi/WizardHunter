'use strict';


define(function(require){

    class Effect {
        
        constructor(effectId){
            console.log('Initializing Effect');
            
            // time since starting
            this.time = 0;

            // time until effect ends
            this.duration = 0;

            this.target = null;
            this.x = 0;
            this.y = 0;

            this.initialize(effectId);
            
        }

        initialize(effectId){

        }

        update(delta){
            this.time += delta;
        }
        
        
    }

    return Effect;
});