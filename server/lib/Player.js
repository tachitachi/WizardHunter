'use strict';


function Player(id, socket){
    
    class Player {
        
        constructor(id, socket){
            
            console.log('Initializing player');
            
            var self = this;
            self.id = id;
            self.socket = socket;
            
            
            // keep track of internal variables like health, animation time, etc
            self.hp = 1000;
            self.x = 0;
            self.y = 0;
            self.angle = 0;
            
            self.targetX = 0;
            self.targetY = 0;
            
            self.moveX = null;
            self.moveY = null;
            
            self.moveSpeed = 300;
        }
        
        
        move(delta){
            var self = this;
            
            // move toward the move target
            if(self.moveX !== null && self.moveY !== null){
                
                var moveAngle = Math.atan2(self.moveY - self.y, self.moveX - self.x);
                var deltaX = self.moveSpeed * delta * Math.cos(moveAngle);
                var deltaY = self.moveSpeed * delta * Math.sin(moveAngle);
                
                self.x += deltaX;
                self.y += deltaY;
                
                if((Math.abs(self.x - self.moveX) < 5) && (Math.abs(self.y - self.moveY) < 5)){
                    self.moveX = null;
                    self.moveY = null;
                }
            }
            
            
            // calculate new angle
            // y axis is reversed, because down is +y
            self.angle = Math.atan2(self.y - self.targetY, self.targetX - self.x);
            if(self.angle < 0){
                self.angle += Math.PI * 2;
            }
            
            
            //console.log(self.angle);
            
        }
        
        get state(){
            var self = this;
            
            var s = {
                ID: self.id,
                hp: self.hp,
                x: self.x,
                y: self.y,
                angle: self.angle,
            }
            
            return s;
        }
        
        
    }
    
    return new Player(id, socket);
}


module.exports = Player;