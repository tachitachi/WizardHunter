'use strict';


define(function(require){

    class Effect {
        
        constructor(effectId){
            console.log('Initializing Effect');
            this.type = 'effect';
            
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
            if(effectId === 0){
                // spawn rock
            }
        }

        update(delta){
            this.time += delta;
        }
        
        
    }

    return Effect;
});