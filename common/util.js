'use strict';

define(function(require){

    return {
        lerp: function(a, b, t){
            return (1 - t) * a + t * b;
        },
        angleLerp: function(a, b, t){
            function shortAngleDist(a0,a1) {
                var max = Math.PI*2;
                var da = (a1 - a0) % max;
                return 2*da % max - da;
            }
            
            return a + shortAngleDist(a,b)*t;
        },
        get: function(obj, prop, d){
            return obj.hasOwnProperty(prop) ? obj[prop] : d; 
        },
        getRigidCollisions: function(objA, deltaX, deltaY, objects){
            // simple pairwise testing for collision
            // assumes all test objects are immovable

            var epsilon = 15;

            for(var i in objects){
                var object = objects[i];
                var dist2 = Math.pow(objA.x + deltaX - object.x, 2) + Math.pow(objA.y + deltaY - object.y, 2);
                var rad2 = Math.pow(objA.size, 2) + Math.pow(object.size, 2);

                if(dist2 < rad2 + epsilon){
                    return {x: 0, y: 0};
                }
            }

            // return a new deltaX, and deltaY to use instead

            return {x: deltaX, y: deltaY};

        },
    };
});