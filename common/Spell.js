'use strict';


define(function(require){
    
    class Spell {
        
        constructor(id, spellId, anchor){
            
            console.log('Initializing Spell', id);

            this.type = 'spell';

            this.id = id;
            this.spellId = spellId;

            // anchor can be a player, creature, obstacle, map, etc.
            this.anchor = anchor;

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

            this.init = true;

            this.initialize();
            
        }

        initialize(){
            // rock wall
            if(this.spellId === 0){
                this.duration = 2.0;
                this.delay = 1.0;
            }
        }

        update(delta){
            this.time += delta;

            if(this.anchor !== undefined){
                //console.log(this.anchor.x, this.anchor.y);

            }
        }

        get state(){
            var s = {
                type: this.type,
                id: this.id,
                anchor: this.anchor,
                x: this.x,
                time: this.time,
                duration: this.duration,
                delay: this.delay,
                cooldown: this.cooldown,
                effects: this.effects,
            }
            
            return s;
        }

        set state(s){

            // Do not interpolate if this unit was newly created
            if(this.init){
                this.init = false;
            }
            else{
                // any values that should be interpolated need to be copied here
            }
            
            this.type = s.type;
            this.id = s.id;
            //this.anchor = s.anchor;
            this.x = s.x;
            this.time = s.time;
            this.duration = s.duration;
            this.delay = s.delay;
            this.cooldown = s.cooldown;
            this.effects = s.effects;
        }

        
    }

    return Spell;
});