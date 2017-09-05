'use strict';

define(function(require){

    console.log('this is core2');

    var GameMap = require('./GameMap');
    var Player = require('./Player');
    var Instance = require('./Instance');

    
    // core should take care of the core game logic
    // there should be nothing here about how network messages are sent, how often, interpolation, lag mitigation, etc
    var timestep = 1 / 200.0;

    function modDelta(delta){
    	var d = Math.floor(delta * 1e9);
    	var t = Math.floor(timestep * 1e9);

    	var n = Math.floor(d / t);
    	var r = d % t / 1e9;

    	return {delta: n * timestep, remainder: r};
    }


    return {Player: Player, Map: GameMap, Instance: Instance, timestep: timestep, modDelta: modDelta};

});