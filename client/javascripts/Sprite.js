'use strict';

define(function(require){

    class Sprite {
        constructor(canvas, image, width, height, frames){
            this.image = image;
            this.canvas = canvas;
            this.width = width;
            this.height = height;
            this.frames = frames;
        }

        render(x, y, width, height, frame_number, angle){

            var sx = frame_number * this.width;
            var sy = 0;
            var sw = this.width;
            var sh = this.height;

            var dw = width;
            var dh = height;

            this.canvas.graph.save();
            this.canvas.graph.translate(x, y);
            this.canvas.graph.rotate(angle);

            this.canvas.graph.drawImage(this.image, sx, sy, sw, sh, -width / 2, -height / 2, dw, dh);

            this.canvas.graph.restore();
        }
    }
    
    return Sprite;
});