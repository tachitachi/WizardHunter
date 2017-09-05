'use strict';


define(function(require){

    var Obstacle = require('./Obstacle');
    var Effect = require('./Effect');
    
    class Spell {
        
        constructor(id, spellId, anchor){
            
            console.log('Initializing Spell', id, anchor.id);

            this.type = 'spell';

            this.id = id;
            this.spellId = spellId;

            // anchor can be a player, creature, obstacle, map, etc.
            this.anchor = anchor;

            this.status = 0;

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
                this.duration = 0.6;
                this.delay = 0.6;
            }
        }

        destroy(){

        }

        get expired(){
            return this.duration > 0 ? this.time > this.duration : false;
        }

        update(instance, delta, updateSubActors){
            this.time += delta;

            if(this.spellId === 0){
                if(this.anchor !== undefined){
                    //console.log(this.anchor.x, this.anchor.y);

                    if(this.status === 0){

                        // spawn wall pieces
                        if(updateSubActors === true){
                            for(var i = -2; i <= 2; i++){

                                var angle = this.anchor.angle + Math.PI / 6 * i;

                                // attempt to spawn a rock
                                var spawnX = this.anchor.x + 100 * Math.cos(angle);
                                var spawnY = this.anchor.y - 100 * Math.sin(angle);

                                var rock = new Obstacle(instance.getNextId());
                                rock.initialize(spawnX, spawnY, {size: 20, movable: false, breakable: false, duration: 5});

                                instance.actors[rock.id] = rock;

                            }
                        }

                        // apply slow to player
                        var slowEffect = new Effect(instance.getNextId(), 0);
                        this.anchor.effects[slowEffect.id] = slowEffect;
                        console.log('applying slow');


                        this.status = 1;
                    }


                }
            }

            
        }

        get state(){
            var s = {
                type: this.type,
                id: this.id,
                anchor: this.anchor,
                status: this.status,
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
            this.anchor = s.anchor;
            this.status = s.status;
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