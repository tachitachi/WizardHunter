'use strict';

(function(exports){

    console.log('this is Inputs');
    
    exports.actions = {
        'move': ['x', 'y'],
        'target': ['x', 'y'],
        'skill': ['id'],
        'stop': [],
    };
    
    
    // Keys are: left mouse, right mouse, q, w, e, r, a, s, d, f, space
    // 0 is up, 1 is down
    class Keys {
        constructor(initial){
            this.keys = [];
            this.pos = {};
            
            
            this.init(initial);
        }
        
        init(initial){
            this.pos['lmouse'] = 0;
            this.pos['rmouse'] = 1;
            this.pos['q'] = 2;
            this.pos['w'] = 3;
            this.pos['e'] = 4;
            this.pos['r'] = 5;
            this.pos['a'] = 6;
            this.pos['s'] = 7;
            this.pos['d'] = 8;
            this.pos['f'] = 9;
            
            if(initial === undefined){
                for(var i in this.pos){
                    this.keys.push(0);
                }
            }
            else{
                this.keys = initial;
            }
        }
        
        getKeys(){
            return this.keys;
        }
        
        get(keyName){
            if(!this.pos.hasOwnProperty(keyName)){
                return null;
            }
            
            return this.keys[this.pos[keyName]];
        }
        
        set(keyName, value){
            if(!this.pos.hasOwnProperty(keyName)){
                return null;
            }
            
            this.keys[this.pos[keyName]] = value;
        }
    }
    
    class InputQueue{
        constructor(){
            this.queue = [];
        }
        
        push(inputs){
            this.queue.push({input: inputs, timestamp: +new Date()});
        }
        
        pop(){
            return this.queue.splice(0, 1);
        }
        
        get length(){
            return this.queue.length;
        }
        
        clear(sequenceId){
            if(sequenceId === null){
                return null;
            }
            
            var prevTimestamp = this.queue.length > 0 ? this.queue[0].timestamp : null;
            
            while(this.queue.length > 0 && this.queue[0].input.sequenceId <= sequenceId){
                var snapshot = this.pop()[0];
                prevTimestamp = snapshot.timestamp;
            }
            
            return prevTimestamp;
        }
    }
    
    exports.Keys = Keys;
    exports.InputQueue = InputQueue;

}(typeof exports === 'undefined' ? this.Inputs = {} : exports));