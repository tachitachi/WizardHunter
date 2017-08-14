
define(function(require){
    
    var io = require('socketio');
    var Canvas = require('canvas');
    var gfx = require('gfx');
    var global = require('global');
    var util = require('util');
    
    var socket = io();
    
    var canvas = new Canvas({
        onClick: function(clickX, clickY){
            socket.emit('moveto', {x: clickX, y: clickY});
        }
    });
    
    var graph = canvas.cv.getContext('2d');
    var animHandle = null;
    
    var GameState = require('GameState');
    
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
    var playerId = 0;
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
        
        
        //gfx.drawCircle(graph, 100, 100, 10, 100);
        
        //tick += 1;
        
        // clear screen
        graph.fillStyle = '#ffffff';
        graph.fillRect(0, 0, canvas.cv.width, canvas.cv.height);
        
        if(_delta > 0 || delta > 0){
            var x = util.lerp(_playerX, playerX, lerp_t);
            var y = util.lerp(_playerY, playerY, lerp_t);
            var angle = util.angleLerp(_playerAngle, playerAngle, lerp_t);
        }
        else{
            var x = playerX;
            var y = playerY;
            var angle = playerAngle;
        }
        
        //console.log(x, y, angle, lerp_t);
        
        lerp_t += delta / _delta;
        lerp_t = Math.min(lerp_t, 1);
        lerp_t = Math.max(lerp_t, 0);
        
        
        // This should be based on the GameState
        // interpolate between prev and current based on delta
        gfx.drawPlayer(graph, x, y, angle);
        
        socket.emit('tick', {targetX: global.targetX, targetY: global.targetY});
                    
        //gfx.drawTriangle(graph, 200, 200, 60, Math.PI * 00.5);
    }
    
    
    // Include player name in this
    socket.emit('init', {});
    
    socket.on('joined', function(message){
        playerId = message.ID;
    });
    
    socket.on('tick', function(message){
       //console.log(message);
       
       var newTick = performance.now();
       _delta = (newTick - prevTick);
       prevTick = newTick;
       lerp_t = 0;
       
       var playerList = message.playerList;
       
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