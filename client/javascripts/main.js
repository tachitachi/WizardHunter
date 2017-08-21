
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
    
    var graph = canvas.cv.getContext('2d');
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
    
    //var tick = 0;
    var playerId = null;
    var playerAngle = 0;
    var playerX = 200;
    var playerY = 200;
    
    var _playerAngle = 0;
    var _playerX = 200;
    var _playerY = 200;
    
    var _delta = 0;
    var lerp_t = 0;
    
    var prevTick = performance.now();
    
    
    var prevGameTick = 0;
    
    function gameLoop(timestamp){
        
        var newGameTick = performance.now();
        var delta = newGameTick - prevGameTick;
        prevGameTick = newGameTick;
        
        // clear screen
        graph.fillStyle = '#ffffff';
        graph.fillRect(0, 0, canvas.cv.width, canvas.cv.height);
        
        
        for(var i in instance.players){
            var player = instance.players[i].lerp(lerp_t);
            //var player = instance.players[i];
            
            gfx.drawPlayer(graph, player.x, player.y, player.angle);
        }
        
        
        lerp_t += delta / _delta;
        lerp_t = Math.min(lerp_t, 1);
        lerp_t = Math.max(lerp_t, 0);
            
        

        sendInput(delta);
    }
    
    
    // Include player name in this
    socket.emit('init', {});
    
    socket.on('joined', function(message){
        playerId = message.ID;
    });
    
    socket.on('tick', function(message){
       //console.log(message);
       
       //console.log(message.sequenceId, sequenceId, queue.length);
       
       queue.clear(message.sequenceId);
       
       
       var newTick = performance.now();
       _delta = (newTick - prevTick);
       prevTick = newTick;
       lerp_t = 0;
       
       var playerList = message.playerList;
       
       instance.copyState(playerList);
       instance.applyAllInputs(playerId, queue.queue);
       //queue.queue = [];
       
       
       for(var i in playerList){
           var player = playerList[i];
           
           if(player.ID === playerId){
               
               _playerAngle = playerAngle;
               _playerX = playerX;
               _playerY = playerY;
               
               playerAngle = player.angle;
               playerX = player.x;
               playerY = player.y;
           }
       }
       
    });
    
    
    animloop(performance.now());
    
    return {}
});