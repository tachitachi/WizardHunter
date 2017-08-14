
define(function(require){
    
    var global = require('global');
    
    class Canvas {
        
        constructor(params){
            var self = this;
            
            self.cv = document.getElementById('game');
            
            self.cv.width = 1280;
            self.cv.height = 720;
            
            self.originX = self.cv.width / 2;
            self.originY = self.cv.height / 2;
            
            self.onClick = params.onClick;
            
            self.cv.addEventListener('mousemove', self.mousemove.bind(self), false);
            self.cv.addEventListener('mouseout', self.mouseout.bind(self), false);
            self.cv.addEventListener('keypress', self.keypress.bind(self), false);
            self.cv.addEventListener('click', self.click.bind(self), false);
            
        }
        
        click(event){
            var self = this;
            
            var offsetX = event.offsetX - self.cv.width / 2;
            var offsetY = event.offsetY - self.cv.height / 2;
            
            self.onClick(offsetX + self.originX, offsetY + self.originY);
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