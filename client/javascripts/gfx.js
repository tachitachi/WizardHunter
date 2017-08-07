define(function(require){



    return {
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
    
    
    }
    
    
});