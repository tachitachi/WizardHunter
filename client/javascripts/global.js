
//module.exports = {
//    targetX: 0,
//    targetY: 0,
//    
//};

define(function(require){

    var Inputs = require('common/Inputs');

    return {
        targetX: 0,
        targetY: 0,
        offsetX: 0,
        offsetY: 0,
        keys: new Inputs.Keys(),
    };
});