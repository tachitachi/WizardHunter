(function(exports){

    console.log('this is map');
    


    exports.test = function(){
        return 'This is a function from shared module';
    };

}(typeof exports === 'undefined' ? this.Map = {} : exports));