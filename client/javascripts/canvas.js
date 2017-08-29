
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
            this.cv.addEventListener('keydown', this.keydown.bind(this), false);
            this.cv.addEventListener('keyup', this.keyup.bind(this), false);
            this.cv.addEventListener('mousedown', this.mousedown.bind(this), false);
            this.cv.addEventListener('mouseup', this.mouseup.bind(this), false);
            this.cv.addEventListener('contextmenu', this.noevent.bind(this), false);
            
        }

        // Transforms global position to a relative position
        transformX(x){
            return x - this.centerX + this.cv.width / 2;
        }

        // Transforms global position to a relative position
        transformY(y){
            return y - this.centerY + this.cv.height / 2;
        }
        
        mousedown(event){
            if(event.which === 1){
                global.keys.set('lmouse', 1);
            }
            if(event.which === 3){
                global.keys.set('rmouse', 1);
            }
            this.onInput();
        }
        
        mouseup(event){
            if(event.which === 1){
                global.keys.set('lmouse', 0);
            }
            if(event.which === 3){
                global.keys.set('rmouse', 0);
            }
            this.onInput();
        }
        
        // TODO: If the mouse is held down and not moved, the player will stop at the initially clicked spot
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
        
        keydown(event){


            switch(event.which){
            case 81:
                global.keys.set('q', 1);
                break;
            case 87:
                global.keys.set('w', 1);
                break;
            case 69:
                global.keys.set('e', 1);
                break;
            case 82:
                global.keys.set('r', 1);
                break;
            case 65:
                global.keys.set('a', 1);
                break;
            case 83:
                global.keys.set('s', 1);
                break;
            case 68:
                global.keys.set('d', 1);
                break;
            case 70:
                global.keys.set('f', 1);
                break;
            }

        }

        keyup(event){

            switch(event.which){
            case 81:
                global.keys.set('q', 0);
                break;
            case 87:
                global.keys.set('w', 0);
                break;
            case 69:
                global.keys.set('e', 0);
                break;
            case 82:
                global.keys.set('r', 0);
                break;
            case 65:
                global.keys.set('a', 0);
                break;
            case 83:
                global.keys.set('s', 0);
                break;
            case 68:
                global.keys.set('d', 0);
                break;
            case 70:
                global.keys.set('f', 0);
                break;
            }
        }

        noevent(event){
            event.preventDefault();
            return false;
        }
        
    } // end Canvas


    return Canvas;
});