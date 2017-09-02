
define(function(require){
    
    var io = require('socketio');
    var Canvas = require('client/javascripts/canvas');
    var gfx = require('client/javascripts/gfx');
    var global = require('client/javascripts/global');
    var util = require('client/javascripts/util');
    var _ = require('underscore');
    
    var core = require('common/core');
    var Inputs = require('common/Inputs');
    
    var Instance = core.Instance;
    var InputQueue = Inputs.InputQueue;
    
    var queue = new InputQueue();
    
    var socket = io();
    
    var sequenceId = 0;
    
    var instance = new Instance();
    
    
    function sendInput(delta){
        var keys = _.extend([], global.keys.getKeys());
        var inputs = {keys: keys, targetX: global.targetX, targetY: global.targetY, sequenceId: sequenceId};
        socket.emit('input', inputs);
        
        sequenceId++;
        
        queue.push(inputs, delta);

    }
    
    var canvas = new Canvas({
        onInput: function(){
            //console.log('clicked');
            //sendInput();
        }
    });
    
    var animHandle = null;
    
    var GameState = require('client/javascripts/GameState');
    
    window.requestAnimFrame = (function() {
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.msRequestAnimationFrame     ||
                function( callback ) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();
    
    window.cancelAnimFrame = (function(handle) {
        return  window.cancelAnimationFrame     ||
                window.mozCancelAnimationFrame;
    })();
    
    
    console.log(canvas.cvs);
    
    function animloop(timestamp){
        animHandle = window.requestAnimFrame(animloop);
        gameLoop(timestamp);
    }
    
    var playerId = null;
    var _delta = 0;
    var lerp_t = 0;
    
    var prevTick = performance.now();
    
    
    var prevGameTick = 0;
    
    function gameLoop(timestamp){
        
        var newGameTick = performance.now();
        var delta = newGameTick - prevGameTick;
        prevGameTick = newGameTick;
        
        // clear screen

        gfx.clear(canvas);

        var myPlayer = instance.actors[playerId];
        if(myPlayer !== undefined){
            // center camera around player plus some offset based on the mouse position
            var player = myPlayer.lerp(lerp_t);
            canvas.centerX = player.x + global.offsetX / 10;
            canvas.centerY = player.y + global.offsetY / 10;
        }
        
        
        // draw actors
        for(var i in instance.actors){

            var actor = instance.actors[i];
            switch(actor.type){
            case "player":
                var player = instance.actors[i].lerp(lerp_t);
                
                gfx.drawPlayer(canvas, player.x, player.y, player.angle, player.size);
                break;
            }

        }

        // TODO: Group all of map drawing into a single function?

        // draw obstacles on map
        for(var i in instance.map.obstacles){
            var obstacle = instance.map.obstacles[i].lerp(lerp_t);
            
            gfx.drawRock(canvas, obstacle.x, obstacle.y, obstacle.size);
        }
        
        
        lerp_t += delta / _delta;
        lerp_t = Math.min(lerp_t, 1);
        lerp_t = Math.max(lerp_t, 0);
            
        

        sendInput(delta);
    }
    
    
    // Include player name in this
    socket.emit('init', {});
    
    socket.on('joined', function(message){
        playerId = message.id;
    });
    
    socket.on('tick', function(message){

        // Clear all processed inputs
        queue.clear(message.sequenceId);
       
        var newTick = performance.now();
        _delta = (newTick - prevTick);
        prevTick = newTick;
        lerp_t = 0;

        var state = message.state;

        instance.copyState(state);
        instance.applyAllInputs(playerId, queue.queue);
       
    });
    
    
    animloop(performance.now());
    
    return {}
});