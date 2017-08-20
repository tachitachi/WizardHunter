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
        
    };
});