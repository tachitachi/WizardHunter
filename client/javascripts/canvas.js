
define(function(require){
    
    var global = require('client/javascripts/global');
    
    class Canvas {
        
        constructor(params){
            var self = this;
            
            self.cv = document.getElementById('game');
            
            self.cv.width = 1280;
            self.cv.height = 720;
            
            self.originX = self.cv.width / 2;
            self.originY = self.cv.height / 2;
            
            self.onInput = params.onInput;
            self.onMove = params.onMousemove;
            
            self.cv.addEventListener('mousemove', self.mousemove.bind(self), false);
            self.cv.addEventListener('mouseout', self.mouseout.bind(self), false);
            self.cv.addEventListener('keypress', self.keypress.bind(self), false);
            self.cv.addEventListener('mousedown', self.mousedown.bind(self), false);
            self.cv.addEventListener('mouseup', self.mouseup.bind(self), false);
            
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
            var self = this;
            var offsetX = event.offsetX - self.cv.width / 2;
            var offsetY = event.offsetY - self.cv.height / 2;
            
            global.targetX = offsetX + self.originX;
            global.targetY = offsetY + self.originY;
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