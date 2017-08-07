
define(function(require){
    
    var io = require('socketio');
    var Canvas = require('canvas');
    var gfx = require('gfx');
    
    var socket = io();
    
    var canvas = new Canvas();
    var graph = canvas.cv.getContext('2d');
    var animHandle = null;
    
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
    
    
    function gameLoop(timestamp){
        //console.log('doing stuff', timestamp);
        
        gfx.drawCircle(graph, 100, 100, 10, 100);
    }
    
    
    animloop(0);
    
    return {}
});