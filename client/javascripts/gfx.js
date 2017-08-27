define(function(require){



    var gfx = {
        drawCircle: function(graph, centerX, centerY, radius, sides) {
            var theta = 0;
            var x = 0;
            var y = 0;

            graph.beginPath();

            for (var i = 0; i < sides; i++) {
                theta = (i / sides) * 2 * Math.PI;
                x = centerX + radius * Math.sin(theta);
                y = centerY + radius * Math.cos(theta);
                graph.lineTo(x, y);
            }

            graph.closePath();
            graph.stroke();
            graph.fill();
        },
        drawTriangle: function(graph, centerX, centerY, size, angle){
            
            graph.beginPath();
            
            var theta = angle;
            for(var i = 0; i < 3; i++){
                var x = centerX + size * Math.sin(theta);
                var y = centerY + size * Math.cos(theta);
                
                theta += Math.PI * 2 / 3;
                
                graph.lineTo(x, y);
            }
            
            graph.closePath();
            graph.stroke();
            graph.fill();
        },
        
        drawPlayer: function(graph, centerX, centerY, angle){
            graph.strokeStyle = 'hsl(' + 250 + ', 100%, 45%)';
            graph.fillStyle = 'hsl(' + 250 + ', 100%, 70%)';
            
            var playerSize = 50;
            var playerSides = 25;
            
            gfx.drawCircle(graph, centerX, centerY, playerSize, playerSides);
            
            angle = angle + Math.PI / 2;
            
            var r = playerSize * 1.2;
            var pointerX = centerX + r * Math.sin(angle);
            var pointerY = centerY + r * Math.cos(angle);
            var triangleSize = 10;
            
            gfx.drawTriangle(graph, pointerX, pointerY, triangleSize, angle);
        },

        drawRock: function(graph, centerX, centerY, size){
            graph.strokeStyle = 'hsl(' + 19 + ', 98%, 22%)';
            graph.fillStyle = 'hsl(' + 29 + ', 100%, 70%)';
            
            var sides = 6;
            
            gfx.drawCircle(graph, centerX, centerY, size, sides);
        },
    
    }
    
    return gfx;
});