"use strict";
/**
 * URL Manager v1.4
 * @autor César Antonio Casas
 * @version 1.4
 * @link https://ar.linkedin.com/in/cesarcasas
  */


module.exports = function(MainMAP, req, res, next, Module){

    var _this = this;
    this.path = req.path;

    var keyCache =  req.host+req.path;



    this.splitPath = function(){
        return this.path === '/' ? ['/'] : (function(){
                var a = _this.path.split('/');
                return a[0] === '' ? a.slice(1) :  a;
        })();
    };

    this.process  = function(){

        var reduce = MainMAP;
        var p = _this.splitPath();
        var fromCache =SISSCore.LocalCache.get(keyCache);


        p.push(req.method.toLowerCase());

        var level = 0;

        if(typeof req.params === "undefined") { req.params = {}; }


        var comodin = null;
        var comodinReduce = null;


        var run  = function(reduce, level){
            if(reduce.length>0) {
                var final = null;
                for(var z=0; z<reduce.length; z++){

                    var last = reduce[z][level];

                    if(SISSCore.Caronte.Object.isArray(last)
                        || SISSCore.Caronte.Object.isFunction(last)){
                        final=last;
                    }//end if

                }//end for


                if(SISSCore.Caronte.Object.isArray(final)===true){
                    console.log("Es un Array ", final.length);

                    var cursor  = 0;
                    var doNext  = function(){
                        if(cursor==final.length) {
                            //next();
                        }
                        else {
                            var fn  = final[cursor++];
                            req.module.mws[fn](req, res, doNext);

                        }
                    };

                    doNext();


                }else {final(req, res, next); }

                return true;
            }else{
                return false;
            }//end else

        }//end run



        var _getLevel = function(map, seg, index){
             var nreduce = [];
             for(var x=0; x<map.length; x++){
                if(map[x][index]===seg) { nreduce.push(reduce[x]); }
                 else if (map[x][index].indexOf(':')>-1) {
                     var key = map[x][index].replace(':','');
                     req.params[key] = seg;
                     nreduce.push(reduce[x]);
                 }//end :param
                 else if(map[x][index].indexOf('*')>-1){
                     comodin = true;
                     comodinReduce = reduce[x];
                 }//end *
             }//end for

             return nreduce;
        }; //end private Method




        for(var x=0; x< p.length; x++){
            if(p[x]!=='') {
                reduce = _getLevel(reduce, p[x], level++);
            }
        }//end for


        if(comodin && reduce.length==0) {
            //* comodin, stay here madafaka

            var staticPath = Module.path.public;
            if(SISSCore.Caronte.fs.existsSync(staticPath+req.path)){

            }else{
                reduce = [comodinReduce];
                level = reduce[0].length-1;
            }

        }//end if comodin




        return run(reduce, level);


    };//end process


}

