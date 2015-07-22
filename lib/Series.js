/**
 * You can stack functions with their arguments.
 * This exports Series object
 * @namespace Series
 */
 module.exports  = function(){
        _this = this;
        
        _this.stock = [];
        
        _this.cursor = 0;
        /**
         * final function from stack
         * @memberOf Series
         * @method fncFinal
         */
        _this.fncFinal = function(){};
        /**
         * add function to stack
         * @memberOf Series
         * @method push 
         * @param  {Function} fnc  function to stack
         * @param  {Object} args function args
         */
        _this.push = function(fnc, args){
             if(typeof _this.stock=="undefined") _this.stock = [];
            _this.stock.push({fnc: fnc, args: args});
        };
        /**
         * list stack
         * @memberOf Series
         * @method showstock
         */
        _this.showstock = function(){
                for(var x=0; x<_this.stock.length; x++) console.log(_this.stock[x]);
        };
        /**
         * Call function from stack.
         * See modules/packages/_buildPackage for example
         * 
         * @memberOf Series
         * @method next
         * 
         */
        _this.next = function(){
            try{
        		if(typeof _this.stock !="undefined" && _this.cursor == _this.stock.length) { _this.fncFinal();        }
                else {   _this.stock[_this.cursor].fnc(_this.stock[_this.cursor].args, _this.next);  _this.cursor++;}
            }catch(e){

            }
        }
        /**
         * Sets final function to stack
         * @memberOf Series
         * @method done
         * @param  {Function}   fnc final function
         */
        _this.done = function(fnc){ _this.fncFinal = fnc};
        /**
         * call next function into stack
         * @memberOf Series
         * @method run
         */
        _this.run = function(){  typeof _this.next!="undefined" ?  _this.next() : null; };
        
        
};


