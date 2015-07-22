"use strict";

/**
 * Package management module. This take care of all package loading and configuration
 * @module packages
 */
module.exports =  function() {


        this.hostPackages = "despegando.travel";

        this.privateModules = [];
        this.publicModules = [];
        this.send = function(str){
            SISSCore.emit('rconsoleMsg', str);
        };


        /**
         * run actions over packages. For example. You can build package or disable
         * @param {Object} data [description]
         * @param {string} data.cmd command name
         * @param {string} data.action action to run
         * @param {Array}  data.data all packages that you want to apply actions
         */
		this.process = function(data){
			var _this = this;
			var cmd = data.data.shift();
			var action = data.data.shift();
			var packName = data.data.shift() ;
            var tpl = data.data.length == 1 ? data.data[0] : 'default';

			console.log("packages.process: >>>", cmd, action, packName, tpl);
			switch(action){
                case  'install' : _this.install(packName); break;
                case  'remove'  : _this.remove(packName); break;
                case  'create'  : _this.createTemplate(packName, tpl); break;
			}//end switch

		};
		
		/**
		 * @param packName package name to install via SISSConsole
		 */
        this.install = function(packName){
            var _this = this;
            console.log(" do install: >>>",  packName);

            _this.send("Conneting "+this.hostPackages);
            SISSCore.dns.resolve({host:this.hostPackages, type:'resolve'}, function(err, data){
                if(err){
                    err.txt = SISSCore.dns.errors[err.code];
                    _this.send(err);
                }else{
                    //host exist and can connect :D
                }//end else
            });
        };

		/**
		 * Validate if a conf is ok.
		 * For this one considers all valid package types, names, version
		 * @param  {Object}  conf package object
		 * @return {Boolean}      if valid or not
		 */
        this.hasFormat = function(conf){
            var validTypes = ["web","transport", "api", "cron","virtual","preload", "postload", "core"];

            if(typeof conf._type=="undefined") {
                Logs.Debug("Error: package !_type");
                return false;
            }//no type declared

            if(typeof conf._name=="undefined") {
                Logs.Debug("Error: package !_name");
                return false;
            }//no type declared

            if(typeof conf._version=="undefined") {
                Logs.Error("Error: package !_version");
                return false;
            }//no type declared

            if(typeof conf._enabled=="undefined") {
                Logs.Error("Error: package !_enabled");
                return false;
            }//no type declared


            if(validTypes.indexOf(conf._type)==-1){
                console.log("Error: package Invalid _type");
                return false;
            }

            return true;
        };
        /**
         * load a package. This validates packages structure, set mongodb and SISS.
         * @required __init__ method in order to load libs packages
         * @param  {Object} conf package to load
         * @return {boolean} true if packages was loaded 
         */
		this.load = function(conf){
			var _this = this;
            var mConf = conf;

            if(!this.hasFormat(mConf)) {  return false; }

			Logs.debug('LOAD MODULE: '+conf._name);



            mConf.native = false;
            var M = { __: mConf};

            var enabled = typeof M.__._enabled ==="undefined" ? true: M.__._enabled;


            if(enabled===false) { Logs.debug('Module '+M.__._name +' disabled'); return;}

				M.path = {
					lib: M.__.__dir__+'lib',
					mws: M.__.__dir__+'mws',
					route: M.__.__dir__+'routes',
					view: M.__.__dir__+'views',
                    public: M.__.__dir__+'public',
                    locales: M.__.__dir__+'locales'
					};
				
				try{
                    var mwsClass = require(M.path.mws);
                }catch(e){
                    return false;
                }//end catch


            var mongodb = null;
            if(typeof	M.__._mongodb !=='undefined' && typeof M.__._mongodb.connection.connection!=='undefined'){
                mongodb =  SISSCore.MongoDB.connect(M.__._mongodb.connection.connection,
                                                 M.__._mongodb.collections || ['None']);
            }else{
                mongodb=false;
            }//end mongo?



            mwsClass.implement({Me: M})
                    .implement({mongodb: mongodb})
                    .implement({internalID : SISSCore.Caronte.md5((Math.random()*100000).toString())});



            M.mws = new mwsClass();



            if(typeof conf.preload!=="undefined" && conf.preload===true){
                if(typeof M.mws.preload!=="undefined"){
                    M.mws.preload(M);
                    _this.registerModule(M, M.__._type === "core" ? 'private' : 'public');
                }//hay preload method
                else {
                    Logs.error("No se definio el metodo preload para "+ M.__._name);
                    return this.registerModule(M, M.__._type === "core" ? 'private' : 'public');
                }//cant run preload method

            }//existe preload, instanciamos su mws y ejecutamos
            else{
                return this.registerModule(M, M.__._type === "core" ? 'private' : 'public');
            }//no hay preload configurado

		};


    /**
     * By lortmorris, ultra BETA ALPHA NINJA++
     * Agregamos un dominio a un package que ya ha sido levantado previamente
     */

    this.addDomain = function(moduleName, domain){
        SISSCore.Logs.debug("Agregando package en modo experimental: "+ moduleName+" "+ domain,2);

        var module = __MODULES__[moduleName] || false;
        if(!module) return false;

        SISSCore.Logs.debug(module.__._domains,2);
        module.__._domains.push(domain);
        __PRIMARYDOMAINS__[domain] = module;
        SISSCore.getRouting(MainMAP ,'web');
        SISSCore.fusionPaths();
        return true;
    };

		/**
		 * register modules domains. This method is used in load method.
		 * 
		 * @param  {Object} module module Object
		 * 
		 * @return {boolean} true if this is registered
		 */
        this.registerModule = function(module, type){
            var type = type || 'public';

            console.log('register domain > dominios asociados: ', module.__._domains);
            //tiene dominios asociados?
            if( typeof module.__._domains==="undefined" || typeof module.__._domains.length=="undefined") module.__._domains=['*'];


            if(typeof module.__._primary !=="undefined" && module.__._primary==true){


                if(module.__._domains[0]==="*"){
                    Logs.debug("Error: domain ", module.__._domains[0]," cant == *");
                    return false;
                }//end if * domain

                for(var x=0; x<module.__._domains.length; x++){
                    var dom = module.__._domains[x];
                    if(dom in __PRIMARYDOMAINS__){
                        Logs.debug("Error: domain ", module.__._domains[x]," already used!");
                        return false;
                    }//end if
                    else{
                        console.log('Primary domain ', module.__._domains[x]," loaded!");
                        __PRIMARYDOMAINS__[module.__._domains[x]] = module;

                    }//end else
                }//end for
            } //es un dominio primario (solo web)
            else{

                for(var x=0; x<module.__._domains.length; x++){
                    var dom = module.__._domains[x];

                    if(typeof __DOMAINS__[dom]!=="undefined")  __DOMAINS__[dom].push(module);
                    else __DOMAINS__[dom]= [module];
                }//end for

            }//no era un dominio primario

            if(type==='public') { this.publicModules.push(module); }
            else {this.privateModules.push(module); }
            global.__REGISTERMODULES__.push(module.__._name);

        };//end method register module
        /**
         * get all modules by specified type. 
         * @param  {string} type type name. Default public
         * @return {Array}      list of modules
         */
        this.getRegisterModule = function(type){
            var type = type || 'public';
            return type==="public" ? this.publicModules : this.privateModules;
        };
        /**
         * save modules into global scope.
         * 
         * @return {[type]} [description]
         */
		this.initModule = function(){
            var _this = this;

            var  doNow = function(type){
                Logs.debug("DoNow called");
                var modules = _this.getRegisterModule(type);

                for(var x= 0; x < modules.length; x++){
                    var M = modules[x];
                    console.log('Running ', M.__._name);
                    global.__MODULES__[M.__._name] = M;
                    global.__ROUTER__[M.__._virtualdir] = global.__MODULES__[M.__._name];
                    if(M.__._type==="cron") { _this.makeCron(M); }
                }//end for
            };//end function

            doNow('private');
            doNow('public');

        };


        this.postloads = function(req, res, next){
            var methods = [];
            for(var m in __MODULES__){
                var module  = __MODULES__[m];
                if(typeof module.__ !=="undefined"
                        && typeof module.__._postload!=="undefined"
                        && module.__._postload===true
                        && module.__._enabled===true
                    ){
                        var item = {};
                        item.moduleName = m;
                        item.func = module.mws.postload;
                        methods.push(item);

                }//es postload

            }//end for

            var async = require('async');
            if(methods.length > 0 ){
                async.eachSeries(methods,function(method,nextPostload){
                    var module = __MODULES__[method.moduleName];
                    var context = {Me:module.mws};
                    method.func.call(module.mws,req,res,nextPostload);
                },function(){
                    next();//End of postloads methods;
                });

            }else{
                next();
            }
        };

        /**
         * executed if package type is cron. Cron package require a run method.
         * 
         *  
         * @param  {Object} module module or package object
         * 
         */
		this.makeCron = function(module){
			var _this = this;


			var s=1000;
			module.intervalId = setInterval(function(){
                module.mws.run();
            }, s*module.__._timer);
			
			__CRONS__.push(module);
			
			if(typeof args['-nocron']!="undefined"){
				console.log("No init cron at startup");
			}else{
				setTimeout(function(){
                    module.mws.run();
                }, 2000);
			}
			
		};
		/**
		 * stop cron
		 * @param  {number} intervalId TODO
		 */
		this.stopCron=function(intervalId){
			clearInterval(intervalId);
		};
		/**
		 * delete package from global scope. Removes MainMap and virtual dir.
		 * Sends message via redis channel
		 * @param  {[type]} packages [description]
		 * @return {[type]}          [description]
		 */
		this.disable = function(packages){
			for(var x=0; x<packages.length; x++){
				var pack=packages[x];
				console.log('desactivando: ', pack);
				if(typeof global.__MODULES__[pack]!='undefined'){
                    SISSCore.emit('rconsoleMsg', 'Shutdown '+pack+'...');


                    SISSCore.emit('rconsoleMsg', 'deleting... '+MainMAP['/'+global.__MODULES__[pack].__._virtualdir]);
					
					
					if(global.__MODULES__[pack].__._type=='web') { 
						SISSCore.Caronte.removeMap('/'+global.__MODULES__[pack].__._virtualdir);
						delete MainMAP['/'+global.__MODULES__[pack].__._virtualdir];
					}
					if(global.__MODULES__[pack].__._type=='api'){
                        SISSCore.Caronte.removeMap('/api/'+global.__MODULES__[pack].__._virtualdir);
						delete MainMAP['/api']['/'+global.__MODULES__[pack].__._virtualdir];
					}

                    SISSCore.emit('rconsoleMsg', 'deleting... '+global.__MODULES__[pack]);
					delete global.__MODULES__[pack];



                    SISSCore.emit('rconsoleMsg', 'Shutdown '+pack+' done!');
					
					
				}//existia
				else{
                    SISSCore.emit('rconsoleMsg', 'Package '+pack+' not found or running');
				}//end else
			}//end for
		};

		/**
		 * @param packName package name for new package
		 * @param tpl template or package type to create (api,cron,web)
		 */
		this.createTemplate =  function(packName, tpl){
			var _this = this;
            var tpl = tpl || "default";
            var templatePath = __droot__+'/lib/siss/template/'+tpl;
            var packFolder = __droot__+"/packages/"+packName;



            this.send("Folder path: "+packFolder);

            if(!SISSCore.Caronte.fs.existsSync(templatePath)){
                _this.send("Template not found: "+tpl);
                return;
            }

            var mkdir = function(path){
                if(!SISSCore.Caronte.fs.existsSync(path)){
                    _this.send('Creating '+path);

                    var act =SISSCore.Caronte.fs.mkdirSync(path);

                    if(!act){
                        _this.send(path+' created');
                    }else _this.send(" can't create " +path);
                }//no existe el path
                else{
                    _this.send(''+path+' already exists!');
                }//existe el path

            };

             _this.send("Creating "+packFolder+" template");
             mkdir(packFolder);
             mkdir(packFolder+'/routes');
             mkdir(packFolder+'/mws');
             mkdir(packFolder+'/lib');
             mkdir(packFolder+'/views');
             mkdir(packFolder+'/public');

            SISSCore.Caronte.fs.copySync(templatePath+'/sisspack.js', packFolder+'/sisspack.js');
            SISSCore.Caronte.fs.copySync(templatePath+'/doctor.js', packFolder+'/doctor.js');
            SISSCore.Caronte.fs.copySync(templatePath+'/routes.js', packFolder+'/routes/index.js');
            SISSCore.Caronte.fs.copySync(templatePath+'/mws.js', packFolder+'/mws/index.js');
            SISSCore.Caronte.fs.copySync(templatePath+'/lib.js', packFolder+'/lib/index.js');
            SISSCore.Caronte.fs.copySync(templatePath+'/index.hbs', packFolder+'/views/index.hbs');
            SISSCore.Caronte.fs.copySync(templatePath+'/404.hbs', packFolder+'/views/404.hbs');
            SISSCore.Caronte.fs.copySync(templatePath+'/favicon.ico', packFolder+'/public/favicon.ico');

            _this.send('package '+packName+' created!');
            _this.send('Edit '+packFolder+'/sisspack.js');

        };//end createTemplate
	
};