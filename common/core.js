'use strict';

define(function(require){

    console.log('this is core2');

    var GameMap = require('./GameMap');
    var Player = require('./Player');
    var GameInstance = require('./GameInstance');
    
    // core should take care of the core game logic
    // there should be nothing here about how network messages are sent, how often, interpolation, lag mitigation, etc

    return {Player: Player, Map: GameMap, Instance: GameInstance};

});