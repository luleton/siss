"use strict";

var Series2 = function(){

    var _this = this;

    var _trunks = {};

    this._jump = function(name){
        console.log("jump to : ", name);
    };


    this._next = function(trunk, cursor, args){
        console.log("next papa ", args);

        if(_trunks[trunk].cursor === _trunks[trunk].stock.length){ return false;}
        _trunks[trunk].stock[_trunks[trunk].cursor].call({
            _jump: _this._jump,
            _next : function(){
                _this._next(trunk, _trunks[trunk].cursor++, arguments);
            }
        });

    };



    this.trunk = function(){
        if(arguments.length<2) { return null; }

        var argarray = [];
        var argkeys = Object.keys(arguments);


        for(var x=0; x<argkeys.length; x++){
            argarray.push(arguments[argkeys[x]]);
        }

        var trunk = argarray.shift();

        if(typeof _trunks[trunk]==="undefined") { _trunks[trunk] = {cursor: 0, stock:[]}; }


        for(var x=0; x < argarray.length; x++){
            var f = argarray[x];
            if(Object.prototype.toString.call(f) === "[object Function]" ){
                _trunks[trunk].stock.push(f);
            }//end if
        }//end for

        return _this;
    };

    this.do  = function(trunk){
        if(typeof _trunks[trunk]==="undefined"){ return false;}
        console.log("iniciando la lista");
        _this._next(trunk, _trunks[trunk].cursor);
    };

};
/*


var series = new Series2();

series.trunk("pepe",
    function(){ console.log("pepe func 1"); this._next(1,2,3); this._jump("luis"); },
    function(){ console.log("pepe func 2"); this._next(4,5,6);},
    function(){ console.log("pepe func 3"); this._next(7,8,9);},
    function(){ console.log("pepe func 4"); this._next(10,11,12);}

).do("pepe");*/
