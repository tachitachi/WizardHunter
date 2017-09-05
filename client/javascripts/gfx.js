'use strict';

define(function(require){

    var Sprite = require('./Sprite');


    var fireball = {};
    fireball.image = new Image();
    fireball.image.src =  'client/images/flame_sprite.png';
    fireball.width = 512;
    fireball.height = 512;
    fireball.frames = 6;
    fireball.frame_rate = 20;


    var gfx = {
        clear: function(canvas){
            canvas.graph.fillStyle = '#ffffff';
            canvas.graph.fillRect(0, 0, canvas.cv.width, canvas.cv.height);
        },
        drawCircle: function(canvas, centerX, centerY, radius, sides) {
            var theta = 0;
            var x = 0;
            var y = 0;

            canvas.graph.beginPath();

            for (var i = 0; i < sides; i++) {
                theta = (i / sides) * 2 * Math.PI;
                x = centerX + radius * Math.sin(theta);
                y = centerY + radius * Math.cos(theta);
                canvas.graph.lineTo(canvas.transformX(x), canvas.transformY(y));
            }

            canvas.graph.closePath();
            canvas.graph.stroke();
            canvas.graph.fill();
        },
        drawTriangle: function(canvas, centerX, centerY, size, angle){
            
            canvas.graph.beginPath();
            
            var theta = angle;
            for(var i = 0; i < 3; i++){
                var x = centerX + size * Math.sin(theta);
                var y = centerY + size * Math.cos(theta);
                
                theta += Math.PI * 2 / 3;
                
                canvas.graph.lineTo(canvas.transformX(x), canvas.transformY(y));
            }
            
            canvas.graph.closePath();
            canvas.graph.stroke();
            canvas.graph.fill();
        },
        
        drawPlayer: function(canvas, centerX, centerY, angle, size){
            canvas.graph.strokeStyle = 'hsl(' + 250 + ', 100%, 45%)';
            canvas.graph.fillStyle = 'hsl(' + 250 + ', 100%, 70%)';
            
            var playerSides = 25;
            
            gfx.drawCircle(canvas, centerX, centerY, size, playerSides);
            
            angle = angle + Math.PI / 2;
            
            var r = size * 1.2;
            var pointerX = centerX + r * Math.sin(angle);
            var pointerY = centerY + r * Math.cos(angle);
            var triangleSize = 10;
            
            gfx.drawTriangle(canvas, pointerX, pointerY, triangleSize, angle);
        },

        drawFireball: function(canvas, centerX, centerY, angle, size, tick){
            var sprite = new Sprite(canvas, fireball.image, fireball.width, fireball.height, fireball.frames);

            var frame_number = Math.floor(tick / (1000 / fireball.frame_rate)) % fireball.frames;

            var x = canvas.transformX(centerX - size / 2);
            var y = canvas.transformY(centerY - size / 2);

            sprite.render(x, y, size, size, frame_number, angle);
        },

        drawRock: function(canvas, centerX, centerY, size){
            canvas.graph.strokeStyle = 'hsl(' + 19 + ', 98%, 22%)';
            canvas.graph.fillStyle = 'hsl(' + 29 + ', 100%, 70%)';
            
            var sides = 6;
            
            gfx.drawCircle(canvas, centerX, centerY, size, sides);
        },
    
    }
    
    return gfx;
});