'use strict';


define(function(require){

    var Effect = require('./Effect');
    
    class Spell {
        
        constructor(id, spellId){
            
            console.log('Initializing Spell', id);
            // keep track of internal variables like health, animation time, etc

            // time since starting
            this.time = 0;

            // time until effect ends
            this.duration = 0;

            // time until can reuse
            this.delay = 0;

            // time until another action is available
            this.cooldown = 0;

            // additional effects triggered
            // {target, effect, trigger_time}
            this.effects = [];

            this.initialize(spellId);
            
        }

        initialize(spellId){
            // rock wall
            if(spellId === 0){
                this.duration = 2.0;
                this.delay = 1.0;
            }
        }

        update(delta){
            this.time += delta;
        }

        
    }

    return Spell;
});