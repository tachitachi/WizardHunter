
define(function(require){
    
    class Canvas {
        
        constructor(params){
            var self = this;
            
            self.cv = document.getElementById('game');
            
            self.cv.width = 1280;
            self.cv.height = 720;
            
            self.cv.addEventListener('mousemove', self.mousemove, false);
            self.cv.addEventListener('mouseout', self.mouseout, false);
            self.cv.addEventListener('keypress', self.keypress, false);
        }
        
        mousemove(event){
            //console.log(event);
        }
        
    } // end Canvas


    return Canvas;
});