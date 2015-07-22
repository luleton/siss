"use strict";
var usage = require("usage");

global.args = require('argsparser').parse();


if(args['-profiler']){
    require('./profiler')(args['-profiler']);
}

global.__droot__ = process.cwd();
global.path = require('path');
global._ = require('underscore');
global.ncp = require('ncp').ncp;

console.log('Init SISS Instance: ', args);
var SISSCore = require(__droot__+'/lib/SISSCore');
SISSCore.conf = require(__droot__+'/conf.js');

global.Logs = SISSCore.Logs;


if(args['-debug']){
    if(typeof args['-debug']==="number"){
        global._debug=args['-debug'];
    }else{
        global._debug=1;
    }

}else{
    global._debug=0;
}

console.log("Debug mode: "+_debug);


global.__MODULES__ = {};
global.__ROUTER__  = {};
global.__DOMAINS__  = {};
global.__PRIMARYDOMAINS__  = {};
global.__CRONS__ = [];




global.__SISS__ = SISSCore.getPrototypes();

global.__MODULES__.SISS = {
    'native': true,
    path:{
        lib:	__droot__+'/lib/',
        mws:	__droot__+'/mws',
        route:	__droot__+'/route',
        view:	__droot__+'/view'
    }
};

global.__REGISTERMODULES__ = [];

var dir = require('node-dir');


var redisConsoleInput = require("redis").createClient();
var redisConsoleOutput = require("redis").createClient();

redisConsoleInput.on("error", function(err) {
    console.error("Redis Service Not Available. Please run command redis-server ", err);
});
redisConsoleOutput.on("error",function(err){
    console.log('Redis Service Not Available. Please run command redis-server '+err);
});



var secretChannelInput = args['-shainput'] || SISSCore.Caronte.sha1('input'+Math.random());
var secretChannelOutput = args['-shaoutput'] || SISSCore.Caronte.sha1('output'+Math.random());

console.log('Secret channel input: ', secretChannelOutput);
console.log('Secret channel output: ', secretChannelInput);


var SISSConsole = require(__droot__+'/lib/siss/Console');
var _SissConsole =  new SISSConsole(redisConsoleOutput, secretChannelOutput);

var SISSPackagesLib = require(__droot__+'/lib/siss/Packages');
var _SISSPackages = new SISSPackagesLib();

redisConsoleInput.subscribe(secretChannelInput);

redisConsoleInput.on('message', function onMessage(channel, message){
    var message = JSON.parse(message);
    _SissConsole.process(message);

});



var SISSApp = {

    debug: false,

    end: function(){

    },

    __init__: function(){

        dir.files(__droot__+'/packages/', function(err, files) {
            if (err) {
                console.log('Error loading packages!');
            }else{
                for(var x=0; x<files.length; x++){
                    var path = files[x];
                    var f = SISSCore.Caronte.fileName(files[x]);

                    if(f==="sisspack.js"){
                        Logs.debug("loading conf file: ", path);
                        var mConf = require(path);
                        mConf.__dir__ = path.replace("sisspack.js", "");

                        if(_SISSPackages.load(mConf)===false){
                            Logs.debug("ERROR: cant load module");
                        }//error load module
                    }//era un sisspack

                }//end for
                _SISSPackages.initModule();
            }//end else
            require('./express');
        });

    }//end __init__ function
};//end SISSApp


SISSApp.__init__();


/**
 * CPU INFO TO BROADCAST
 */

setInterval(function() {
    var options = {};
    usage.lookup(process.pid, options, function(err, stat) {


    });
}, 500);
