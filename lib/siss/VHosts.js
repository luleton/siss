"use strict";

module.exports = function(req, res, next){


    res.req = req;
    var getModuleByVirtualDir = function(dirmod){

        dirmod = typeof dirmod === "undefined" ? req.path : dirmod;

        dirmod = dirmod.split("//").join("/");


        if(dirmod[0]!=="/") { dirmod="/"+dirmod; }
        if(dirmod[dirmod.length-1]!=="/"){ dirmod = dirmod+"/"; }


        var modreturn = "";
        var min= dirmod.length;

        for(var m in __MODULES__){
            var mod = __MODULES__[m];
            var vd = !mod.native && typeof mod.__._virtualdir !== "undefined" ? mod.__._virtualdir : "";

            if(vd!==""){
                if(vd[0]!=="/") { vd = "/"+vd; }
                if(vd[vd.length-1]!=="/") { vd = vd+"/"; }

                if(dirmod.indexOf(vd)>-1){

                    if(dirmod.replace(vd,"").length<=min){
                        min = dirmod.replace(vd,"").length;
                           modreturn = m;
                    }
                }
            }//is valid path

        }


        return modreturn;
    };





    var output = true;

    //by lortmorris
     req.domain = {
         exit: function(a){ }
         ,enter: function(a){}
     };

    next = typeof next === "undefined" ?  function(){ } : next;


    var _m = {
        path:{view: __droot__+'/views' }
    };


    /**
     * Arrancamos a procesar :D
     */

    res.__auth= true;
    req.originalPath = req.path.length>1 && req.path[req.path.length-1] === "/" ? req.path.slice(0,-1) : req.path;

    var isAPI = false;



    /**
     * Validates if domain param belongs to __DOMAINS or _PRIMARYDOMAINS__ global 
     * @param  {string} domain path to evaluate
     * @return {boolean} true if exists
     */
    var existDomain = function(domain){
        return (typeof __DOMAINS__[domain]!=="undefined" || typeof __PRIMARYDOMAINS__[domain]!=="undefined") ? true: false;
    };

    /**
     * Validates if domain param belogs to __PRIMARYDOMAINS__
     * @param  {string}  domain domain name
     * @return {boolean} true if exists
     */
    var isPrimary = function(domain){
        return typeof __PRIMARYDOMAINS__[domain] === "undefined" ? false: true;
    };


    var doPrimaryDomain = function(host){

        var _m = null;


        if(typeof __MODULES__[req.module]==="undefined"){
            req.module = _m =  __PRIMARYDOMAINS__[host];

        }else{
            req.module = _m = __MODULES__[req.module];
        }


        req.paths = _m.path;

        var vd  = _m.__._virtualdir;
        vd = vd[0] === "/" ? vd: "/"+vd;


        if(req.path==="/"){
            var file = "";
            var check = false;
        }else{
            var file = req.paths.public+req.path.replace(vd, "");
            var check = true;
        }


        if(check && vd!=="/" && SISSCore.Caronte.fs.existsSync(file)){

            output = true;
        }else{


            if(!new SISSCore.URL(_m.MainMAPTable, req, res, next, _m).process()){
                output = true;
            }else {
                output = false;
            }//end else
        }//isnt static file

    };





    var doDefaultDomain = function(host, module){
        Logs.debug("run: doDefaultDomain "+host+" "+module, 3);


        if(typeof __MODULES__[module] === "undefined"){
            Logs.debug("doDefaultDomain.module not exist! ", 3);
            res.__auth = true;
            req.module = "";
            Logs.debug('Pidieron por un modulo que no existe en un dominio que no es primario! ', 3);
            res.send('File not found');
            output = false;
            return false;
        }else{

            _m =  __MODULES__[module];

            req.module = _m;
            req.paths = _m.path;

            Logs.debug("set path real: "+req.paths.public, 3);

            Logs.debug("getModuleRequire is true! ", 3);

            if(!new SISSCore.URL(_m.MainMAPTable, req, res, next, _m).process()){
                output = true;
            }else {
                output = false;
            }//end else


        }//end else


    };//el dominio default


    var doStepOne = function(){

        if(!existDomain(req.host)){
            req.domain.exists = false;
            res.send('Domain no registered!');
            output = false;

        }else{
            Logs.debug("el dominio existe");
            req.domain.exists = true;
            //el dominio es primario
            if(isPrimary (req.host)){
                Logs.debug("Es dominio primario");
                doPrimaryDomain(req.host);

            }else{
                Logs.debug("No es dominio primario, vamos por defecto", 100);
                doDefaultDomain(req.host, req.module);
            }//no es primario
        }//domain exists!

    };//end if doStepone






    /**
     * Base init code XD
     */

    var module = "";
    if(req.path.indexOf("/api") >-1){ //is api called
        module = req.path.replace("/api","").split("/")[1] || '';
        isAPI=true;

        if(module.trim()==""){
            res.send('API called without package');
            req.module = "api";
            output=false;
        }else {


            if(typeof __MODULES__[getModuleByVirtualDir(module)] === "undefined"){
                var respo=new SISSCore.apiResponse(404,null,"Module not found.");
                res.json(respo);
                req.module = "api";
                output = false;
            }else{
                var apiMAP = MainMAP['/api']['*'];
                req.module = getModuleByVirtualDir(module);
                if(typeof apiMAP[req.method.toLowerCase()] !=="undefined"){
                    var cbs = apiMAP[req.method.toLowerCase()];

                    __MODULES__['api'].mws[cbs[0]](req, res, function(req, res, next){

                    });

                }//end if

                doStepOne();
            }//end else module exists
        }//end isAPI and Package
    }else{
        module = req.path.split("/")[1];
        req.module = module = getModuleByVirtualDir();
        if(module!==""){
            if(typeof __MODULES__[module]!=="undefined" && __MODULES__[module].__._primary) { req.domain.primary = true; }
            else {
                req.domain.primary = false;
            }//end else
        }else {
            req.domain.primary = true;
        }//end else


        doStepOne();
    }


    if(output) { next(); }
    else{

    }

};

