'use strict';


define(function(require){


    var Obstacle = require('./Obstacle');

	class GameMap {
        constructor(){
            console.log('Initializing Map');
            // keep track of internal variables like health, animation time, etc
            
            this.width = 1000;
            this.height = 700;

            this.obstacles = {};

            // randomly add obstacles
            for(var i = 0; i < 15; i++){
                var x = Math.floor(Math.random() * this.width);
                var y = Math.floor(Math.random() * this.height);
                var obstacle = new Obstacle(i);

                obstacle.initialize(x, y, {type: 0, size: Math.random() * 15 + 5, movable: false, breakable: false})

                this.obstacles[i] = obstacle;
            }
        }



        get state(){
            var state = {obstacles: this.obstacles};
            return state;
        }

        set state(state){
            for(var i in this.obstacles){
                if(!state.obstacles.hasOwnProperty(i)){
                    delete this.obstacles[i];
                }
            }

            for(var i in state.obstacles){
                var remoteObstacle = state.obstacles[i];
                if(!this.obstacles.hasOwnProperty(i)){
                    this.obstacles[i] = new Obstacle(remoteObstacle.id);
                    this.obstacles[i].initialize(remoteObstacle.x, remoteObstacle.y);
                }

                this.obstacles[i].state = remoteObstacle;
            }

        }
    } // End Map


    return GameMap;
});