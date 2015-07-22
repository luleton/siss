/**
 * SISS v1.4
 * @type application server
 * @autor César Casas, https://ar.linkedin.com/in/cesarcasas
 * @developers Oscar Lopez
 */


var __droot__ = process.cwd();


require('./banner.js');
var path = require('path');
var _ = require('underscore');
var args = require('argsparser').parse();
var ncp = require('ncp').ncp;
var http = require("http");
var httpProxy = require('http-proxy');
var os = require("os");
ncp.limit = 2;


var server = {
    _processors: []
    ,debug: false
    ,isArray: function(a){ return Object.prototype.toString.call( a ) == "[object Array]" ? true: false}
    ,_id : 0
    ,serverPath: __droot__+'/start.js'
    ,_forks: []
    ,_cursorFork:0
    ,nextFork : function(){
        var _this = this;
        return _this._cursorFork == _this._forks.length ? _this._forks[_this._cursorFork=0] : this._forks[_this._cursorFork++];
    }
    ,init: function(){
        var _this = this;

        var port  = parseInt(args['-port'] || 4000);
        process.on('exit', function() {
            _this._processors.forEach(function(p) {
                p.instance.kill();
            });
        });

        var hasPort = false;
        var arg = [];


        if(typeof args['-shainput'] != "undefined"){
            arg.push('-shainput');
            arg.push(args['-shainput']);
        }

        if(typeof args['-shaoutput'] != "undefined"){
            arg.push('-shaoutput');
            arg.push(args['-shaoutput']);
        }

        if(typeof args['-debug'] != "undefined"){
            arg.push('-debug');
            arg.push(args['-debug']);
        }

        if(typeof args['-profiler'] != "undefined"){
            arg.push('-profiler');
            arg.push(args['-profiler']);

        }

        if(typeof args['-interface'] != "undefined"){
            arg.push('-interface');
            arg.push(args['-interface']);
        }

        if(typeof args['-localhost'] != "undefined"){
            arg.push('-interface');
            arg.push("localhost");
        }


        //run CPU Instances
        var initPORT = args['-pport'] || 3800;
        var totalcpu = args['-cluster'] ? os.cpus() : ['single'];

        if(args['-cluster']) {
            console.log("TOTAL CPU > ", totalcpu);
            for (var x = 0; x < totalcpu.length; x++) {
                _this._forks.push({port: initPORT});
                _this.makeInstance(arg.concat(['-port', initPORT++]));
            }//end for cpu
            _this.listen(port);
        }//end cluster
        else{
            _this.makeInstance(arg.concat(['-port', port ]));
        }//no cluster



    }

    ,listen: function(port){

        var _this = this;
        var proxy = httpProxy.createProxyServer({});

        proxy.on('proxyReq', function(proxyReq, req, res, options) {
            proxyReq.setHeader('X-SISS-Proxy-Header', 'v1.4');
        });

        var server = http.createServer(function(req, res) {

            var nf = _this.nextFork();
            var target = 'http://127.0.0.1:'+nf.port;
            proxy.web(req, res, {
                target: target
            });
        });

        server.listen(port);


    }
    ,addInstance: function(instance, args){
        var _this = this;
        return _this._processors.push({_id: _this._id++, instance: instance, args: args});
    }
    ,makeInstance:function(arg){
        var _this = this;

        console.log('Exec: ', _this.serverPath, arg);
        var cp = require('child_process').fork(_this.serverPath, arg);
        console.log("CP PID" , cp.pid, " ARGS> ", args);

        cp.on('exit', function(code) {
            var errorStr = 'SISS ' + _this.serverPath + '" crashed! Exit code: ' + code + '. Restarting...';
            setTimeout(function() {
                _this.makeInstance(arg);
            }, 1000);
        });

        return _this.addInstance(cp, arg);

    }//end makeInstance

};

server.init();
