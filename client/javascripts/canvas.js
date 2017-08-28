
define(function(require){
    
    var global = require('client/javascripts/global');
    
    class Canvas {
        
        constructor(params){
            
            this.cv = document.getElementById('game');
            
            this.cv.width = 1280;
            this.cv.height = 720;
            
            this.centerX = this.cv.width / 2;
            this.centerY = this.cv.height / 2;
            
            this.onInput = params.onInput;
            this.onMove = params.onMousemove;

            this.graph = this.cv.getContext('2d');
            
            this.cv.addEventListener('mousemove', this.mousemove.bind(this), false);
            this.cv.addEventListener('mouseout', this.mouseout.bind(this), false);
            this.cv.addEventListener('keypress', this.keypress.bind(this), false);
            this.cv.addEventListener('mousedown', this.mousedown.bind(this), false);
            this.cv.addEventListener('mouseup', this.mouseup.bind(this), false);
            
        }

        transformX(x){
            return x - this.centerX + this.cv.width / 2;
        }

        transformY(y){
            return y - this.centerY + this.cv.height / 2;
        }
        
        mousedown(event){
            global.keys.set('lmouse', 1);
            this.onInput();
        }
        
        mouseup(event){
            global.keys.set('lmouse', 0);
            this.onInput();
        }
        
        mousemove(event){
            var offsetX = event.offsetX - this.cv.width / 2;
            var offsetY = event.offsetY - this.cv.height / 2;
            
            global.offsetX = offsetX;
            global.offsetY = offsetY;
            global.targetX = offsetX + this.centerX;
            global.targetY = offsetY + this.centerY;
        }
        
        mouseout(event){
            
            global.targetX = null;
            global.targetY = null;
        }
        
        keypress(event){
            
        }
        
    } // end Canvas


    return Canvas;
});