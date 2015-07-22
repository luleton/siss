"use strict";

/**
 * @global
 */
global.events = require('events');
/**
 * @global
 */
global.eventEmitter =  new events.EventEmitter();


/**
 * SISSCore object available for all. Provides tools for packages
 * 
 * @author Cesar Casas
 * @namespace
 * @since 1.4
 */


var SISSCore={

        /**
         * Save event with callback(function to run once that event its fired)
         * @param  {string}   evt      event name. When this happened, callback is fired
         * @param  {Function} callback funciton to run when event its invoked
         * @return {Object}            return eventEmitter, so calls can be chained
         */
		on: function(evt, callback){
			return eventEmitter.on(evt, callback);
		},
        storareMWS: [],

        Caronte:       require(__droot__+"/lib/Caronte"),
        Mail:          require(__droot__+'/lib/siss/Mail'),
        Cache:         require(__droot__+'/lib/siss/Cache'),
        Series:        require(__droot__+"/lib/Series"),
        Series2:        require(__droot__+"/lib/Series2"),
        HBS:           require(__droot__+"/lib/HBS"),
        DB:            require(__droot__+"/lib/DB"),
        Collections:   require(__droot__+'/lib/siss/Collections'),
        Transactions:  require(__droot__+'/lib/siss/Transactions'),
        MongoDB:       require("mongojs"),
        MongoDBExtra:  require(__droot__+"/lib/siss/mongodbextra"),
        OS:            require(__droot__+"/lib/siss/OS"),
        os:            require(__droot__+"/lib/siss/OS"),
        URL:           require(__droot__+'/lib/siss/URL'),
        DNS:           require(__droot__+"/lib/siss/DNS"),
        apiResponse :  require(__droot__+'/lib/siss/APIResponse.js'),
        Logs:          require(__droot__+"/lib/Logs"),
        MWS:           require(__droot__+"/lib/siss/MWS"),
        compatible:    require(__droot__+"/lib/compatible"),
        Static:        require(__droot__+"/lib/siss/Static"),
        Class:         require(__droot__+'/lib/Class'),
        Performance:   require(__droot__+'/lib/Performance'),
        Packages:      require(__droot__+'/lib/siss/Packages'),
        Renders: {
                    html: require(__droot__+'/lib/siss/renders/html')
            },
        defineGetter: function(obj, property, call){
                    Object.defineProperty(obj, property, {
                       get: call
                    });
         },
        require: function(packName, version){
                var version = version || '*';

                try{
                    return require(packName);
                }catch(e){
                    console.log("Error, cant load ", packName);
                }//end catch
        },
        /**
         * fire all registered events into params. This method receive all events that you want to run
         * 
         * @memberOf SISSCore
         * @method emit
         */
		emit: function(){
			var args = [];
			for(var x=0; x<arguments.length; x++) args.push(arguments[x]);
			
			if(args.length==0) return;
			if(args.length==1)	eventEmitter.emit(args[0]);
			else{
				var evt = args[0];
				args.shift();
				eventEmitter.emit(evt, args);
			}
		},
        /**
         * remove all listeners from eventEmitter. For more information see eventEmitter doc.
         * @type {Funtion}
         */
        removeAllListeners: eventEmitter.removeAllListeners,
        /**
         * Wrapper SISSCore.emit method
         * @type {Function}
         */
		fire:this.emit,
        /**
         * log errors
         * @param  string str error message
         */
		err: function(str){
			console.log(str);
		},

        /**
         * show any message 
         * @param  string str message
         */
		log: function(str){
			console.log(str);
		},
        getLocales: function(){
            return require(__droot__+'/lib/siss/Locales');
        },
        /**
         * obtenins proptotypes
         * @return {Object} object that contains methods for access to loaded libraries. Used for __SISS__ global object
         */
		getPrototypes: function(){
			return require(__droot__+'/lib/siss/Protypes.js');
		},
        /**
         * Object for validates virtual hosts. View packages structures
         * @param  {Object}   req  request object from express.js
         * @param  {Object}   res  response object from express.js
         * @param  {Function} next call to next midd o request
         * @return Object}        virtual host validate object
         */
        checkVirtualHost: function(req, res, next){
            return require(__droot__+'/lib/siss/VHosts.js')(req, res, next);
        },
        /**
         * TODO Implementation
         */
		load: function(){
		
		},
        install:function(args){
			console.log('Installing...', args);
        },

         /**
          * This is used into .routes from SISSCore
          *
          * Scan routes from /routes in all loaded packages.
          * 
          * @memberOf SISSCore
          * @method getRouting
          * @param  {Object} MainMAP HTTP Methods maps to controlAPI
          * @param  {string} type    Package type(api)
          */
        getRouting: function(MainMAP, type){

            var type=type || 'web';
            SISSCore.Logs.debug('loading routings: '+ ' '+type,2);
            var z = 0;
            for(var x in __MODULES__){
                var m = __MODULES__[x];

                if(!m.native && m.__._type==type){
                    __MODULES__[x].MainMAP = {};
                    var vdir = m.__._virtualdir;

                    //es primario?
                    if(typeof m.__._primary!="undefined" && m.__._primary) {

                        if(typeof m.__._domains =="undefined") m.__._domains=['*'];

                        for(var d=0; d<m.__._domains.length; d++){
                            __PRIMARYDOMAINS__[m.__._domains[d]].MainMAP = mp = {'/':require(m.path.route)(m.mws)};
                        }//end for domains

                    }//end if
                    else  {//no es primario

                        var mp = require(m.path.route)(m.mws);
                        MainMAP['/'+m.__._virtualdir] = mp;

                        if(typeof __MODULES__[x].MainMAP == "undefined") __MODULES__[x].MainMAP = {};

                        if(m.__._type == 'api')  {   __MODULES__[x].MainMAP['/api/'+vdir] =  mp; }
                        else __MODULES__[x].MainMAP['/'+vdir] = mp;
                    }//end else

                } //end if
            }//end for


        },

        /**
         * Includes MainMap from each package into PRIMARYDOMAIN.
         * @memberOf SISSCore 
         * @method fusionPaths
         *   
         */
        fusionPaths : function(){
            SISSCore.Logs.debug("______________FUSIONPATH_____________________",2);
            var _scan = function(pd){
                for(var m in __MODULES__){
                    var mod = __MODULES__[m];
                    if(typeof mod.__ !=="undefined" && typeof mod.__._domains !=="undefined"){
                        for(var x=0; x< mod.__._domains.length;x++){
                            var d= mod.__._domains[x];
                            if(pd===d && mod.__._primary!==true){
                                SISSCore.Caronte.Object.union(__PRIMARYDOMAINS__[pd].MainMAP,mod.MainMAP);
                            }
                        }//end for domains
                    }//end if existen los dominios
                }
            };//end scan


            for(var pd in __PRIMARYDOMAINS__){
                _scan(pd);
                __PRIMARYDOMAINS__[pd].MainMAPTable = SISSCore.Caronte.Object.$transformToTable(__PRIMARYDOMAINS__[pd].MainMAP);
            }//end for

            for(var mod in __MODULES__){
                if(typeof __MODULES__[mod].MainMAPTable == "undefined" ){
                    __MODULES__[mod].MainMAPTable = SISSCore.Caronte.Object.$transformToTable(__MODULES__[mod].MainMAP);
                }//end if
            }//end for

        },

		/**
         * Send response data(json or string) by express. Can use if you need response an api service.
         * @memberOf SISSCore
         * @method json
         * @param  {Object | string} data data to response
         * @param  {Object} res  Response object from express.js
         */
		json: function(data, res, mws){
            var compress = res.compress || false;
            var mws = mws || {};
            var req = res.req || {};

            if(compress){
                res.send(data);

            }else{
                res.json(data);
            }//end else compress

		},
        /**
         * Send response string by express. Useful for messages
         * @memberOf SISSCore
         * @method send
         * @param  {string} data string to send by http/s
         * @param  {Object} res  response object from express.js
         */
		send: function(data, res){
            var mws = mws || {};
			res.send(data);
		},
        /**
         * Use this if you need render html/hbs view with json data by express.js
         * Only use in  web packages
         * @memberOf SISSCore
         * @method render
         * @param  {string} view url for view access
         * @param  {Object} data dato to fill view
         * @param  {Object} res  response object from express for render view
         */
		render: function(view, data, res, mws, htmlcb){
            var mws = mws || {};
			data.layoutURL="";
            var htmlcb = htmlcb || null;

            try{
                var host=res.req.headers.host.split(":")[0];
    			
    			if(typeof data.mws !=="undefined"){

    				if("_layout" in data.mws.Me.__){

                        if(host in data.mws.Me.__._layout){
                            var configDom=data.mws.Me.__._layout[host];
                            var layoutToUse=__MODULES__[configDom.package].path.view+"/layout.hbs";
                            data.layout=layoutToUse;
                            data.layoutURL = SISSCore.appHTTPS ? "https":"http"+"://"+configDom.domain+":"+_port;

                        }//end if
    				}//end if
    			}//end if

    			res.render(view, data, htmlcb);

            }catch(e){
                Logs.error(e);
                res.render(view, data, htmlcb);
            }
		},
        /**
         * @callback SISSCore~spoolerCallback
         */
        /**
         * Store object in a mongodb collection associated to a transaction id(TID)
         * @memberOf SISSCore
         * @method spooler
         * 
         * @param  {Object}   data   object to save
         * @param  {Object}   driver db with transactions collection
         * @param  {string}   tid    Transaction ID
         * @param  {SISSCore~spoolerCallback} cb     callback to run after save object
         */
		spooler: function(data, driver, tid, cb){
			var tid = tid || 'NoTID';
            var cb = cb || function(){};
            var toSave = {
                data:data,
                tid:tid,
                datetime: new Date(),
                finish : false
            };

			driver.transactions.save(toSave, function(err, docs){
                    cb();
			});
		},
        /**
         * close a transaction that previously its was saved into driver.transactions collection
         *
         * @memberOf SISSCore
         * @method closeTransaction
         * @param  {Object} driver collection with transactions objects
         * @param  {string} tid    Transaction ID
         */
        closeTransaction: function(driver, tid){
                var tid = tid || 'NoTID';

                var where = { tid:tid };
                var value = { $set: {finish: true}};

                driver.transactions.update(where, value,{multi:true}, function(err, docs){
                    console.log("Transaction cerrada: ", tid, err, docs);
                });
        },
        /**
         * @callback SISSCore~getTransactionCallback
         * @param {object} err error object
         * @param {object} docs transactions objects by tid  
         */
        /**
         * get transactions by tid from transctions collections. 
         *
         * @memberOf SISSCore
         * @method getTransaction
         * 
         * @param  {Object}   ColTransactions mongodb collection for transactions
         * @param  {string}   tid             transaction id
         * @param  {SISSCore~getTransactionCallback} callback        function to run after execute find method
         */
		getTransaction: function(ColTransactions, tid, callback){
			var tid = tid || 'NoData';
			
			ColTransactions.find({tid: tid}, {}).toArray(function(err, docs){
				callback(err, docs);
			});
		},
		io: function(res, req, next){
			//next(res, req, next);
		},
        /**
         * headers for cross clients application.
         * @memberOf SISSCore
         * @method cross
         * 
         * @param  {Object}   req  request object from express.js
         * @param  {Object}   res  response object from express.js
         * @param  {Function} next call next request or middleware
         */
		cross: function (req, res, next) {

		    res.setHeader('Access-Control-Allow-Origin', '*');
		    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
		    res.setHeader('Access-Control-Allow-Credentials', true);


            next();
		},

        /**
         * Fix the req.ip for proxys
         * @param req
         * @param res
         * @param next
         */
        realip: function (req, res, next) {

            if(req.headers && req.headers['x-forwarded-for']){
                var parts = req.headers['x-forwarded-for'].split(",");
                req.realip  = parts[0];
            }else{
                req.realip = req.ip;
            }

            next();
        },


        /**
         * @callback SISSCore~requestCallback
         * function to run after http request
         * @param {Object} err error object
         * @param {Object} res response object from request
         */
         /**
          * SISSCore Request Method. Use this for all http/s request into any package.
          * @memberOf SISSCore
          * @method request
          * @param {Object} RequestOptions Params for http/s request
          * @param {string} RequestOptions.json if you need do a request with a entire json. Use this property
          * @param {string} RequestOptions.data if you need do a request with a entire xml o json string. Use this property
          * @param {string} RequestOptions.host host API url (without service invocation)
          * @param {string} RequestOptions.path service url (build with params if you need)
          * @param {string} RequestOptions.method HTTP method (GET,POST,etc)
          * @param {string} RequestOptions.typeprotocol http or https
          * @param {Object} RequestOptions.headers headers for request
          * @param {string} RequestOptions.headers.Accept Content-Type. Example: application/json, application/xml
          * @param {string} RequestOptions.headers.Accept-Encoding 'gzip, deflate
          * @param {string} RequestOptions.headers.X-ApiKey api key in order to validate request to api
          * @param  {SISSCore~requestCallback} callback   callback to run after response
          */
        request: function(RequestOptions, callback){
            Logs.debug("SISSCore.Request: ",2);
            Logs.debug(RequestOptions,2);
            var http = require('http');
            var https = require('https');
            var zlib = require('zlib');

            var stream = function(){
                this.str =  "";
                this.data = function(e){ };
                this.end = function(){
                    callback(null, this.str);
                };
                this.on		= function(a,b){}
                this.once	= function(a, b){}
                this.emit	=  function(a, b){}
                this.write	= function(buff){
                    this.str+=buff.toString();
                };
                this.error	= function(e){ console.log('error stream gzip: ');}
            };

            var cb = function (response) {
            	if(typeof _debug!=="undefined" && _debug===true){
	                
	                Logs.debug("statusCode:",2);
	                Logs.debug(response.statusCode,2);

                      Logs.debug("headers:",2)
                      Logs.debug(response.headers,2);
            	}

                switch (response.headers['content-encoding']) {

                    case 'gzip':
                        response.pipe(zlib.createGunzip()).pipe(new stream());
                        break;

                    case 'deflate':
                        response.pipe(zlib.createInflate()).pipe(new stream());
                        break;

                    default:
                        response.pipe(new stream());
                        break;
                }//end switch

            };//end callback

            var jstring = "";
            var typeprotocol = RequestOptions.typeprotocol || 'http';
            Logs.debug('typeprotocol: ',2);
            Logs.debug(typeprotocol,2);

            RequestOptions.headers = RequestOptions.headers || {};

	        /**
	         * Pidieron JSON, a darle atomos
	         */
            if("json" in RequestOptions){

                jstring = JSON.stringify(RequestOptions.json);

                RequestOptions.headers['Content-Type']=  'application/json',
                RequestOptions.headers['Content-Length'] =  Buffer.byteLength(jstring, 'utf8');
            }//end if json
            
            /**
             * post xml/json
             */
            if("data" in RequestOptions){
            	jstring = RequestOptions.data;
            	
                RequestOptions.headers['Content-Length'] =  Buffer.byteLength(jstring, 'utf8');
            }


            if(typeprotocol=='http'){
                Logs.debug('vamos por http: ',2);
                Logs.debug(RequestOptions.host,2);

                //Default por http
                RequestOptions.port = RequestOptions.port || 80;
                
                var r = new http.request(RequestOptions, cb);
                if("json" in RequestOptions) r.write(jstring);
                
                if("data" in RequestOptions) r.write(jstring);
                r.end();

            }//es http
            else{
                 Logs.debug('vamos por https: ',2);
                 Logs.debug(RequestOptions.host,2);
                 
                 //default port https
                 RequestOptions.port = RequestOptions.port || 443;
                 
                 var r = new https.request(RequestOptions, cb);

                 if("json" in RequestOptions) r.write(jstring);
                
                 if("data" in RequestOptions) r.write(jstring);
                 r.end();

            }//end else protocol

            r.on('response', function(r){

            }).on('error', function(e){
                    console.log('Error stream object: ',RequestOptions,  e);
                    callback(e, e);
                });

        },

        /**
         * Retrieve a module by name. This method search y __MODULES__ if exists else return null
         * @memberOf SISSCore
         * @method getModule
         * @param  {string} name module name
         * @return {Object}      module object
         */
         getModule : function(name){
         	if(name in __MODULES__){
         		return __MODULES__[name];

         	}else{
         		return null;
         	}

         },
        registerLib: function(name, lib){
            console.log(typeof lib);
            SISSCore.__LIBS__[name] = lib;
        },
        getLib: function(name){
            if(!name in SISSCore.__LIBS__) return null;
            else return SISSCore.__LIBS__[name];
        }
        ,registerMWS : function(fnc){
            var _this = this;
            _this.storareMWS.push(fnc);
         }
        ,runRegisteredsMWS : function(req, res, next){
            var _this = SISSCore;

            if(_this.storareMWS.length==0) {
                next();
                return;
            }

            var cursor  = 0;
            var doNext  = function(){
                if(cursor==_this.storareMWS.length) {
                    next();
                }
                else {

                    _this.storareMWS[cursor++](req, res, doNext);
                }
            };

            doNext();

        }



};

SISSCore.LocalCache = new SISSCore.Cache();
global.SISSCore = module.exports = SISSCore;
