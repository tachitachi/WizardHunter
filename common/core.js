(function(exports){

    console.log('this is core');


    exports.test = function(){
       return 'This is a function from shared module';
    };

}(typeof exports === 'undefined' ? this.core = {} : exports));