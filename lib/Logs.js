
var clc = require('cli-color');
var util = require('util');

/**
 * This exports Logs object. See tutorial 
 * @namespace Logs
 * 
 * 
 * 
 * @type {Object}
 */

module.exports ={
        /**
         * Add an url to track. This is saved into satLogs 
         * @memberOf Logs
         * @method track
         * @param  {Object} req request object with params to track
         */
        track:function(req){
                var dataLog = {
                                url: req.url
                                ,session: req.session
                                ,query: req.query
                                ,body: req.body
                                ,route: req.route.params
                                ,headers: req.headers
                                ,method: req.bymethod
                                ,DateTime: new Date()
                        };

        }
        /**
         * 
         * Send error message by Redis Channel
         * @memberOf Logs
         * @method rlog
         * @param  {Object} data redis object for suscribe to SISLogsRT
         * @param {string} data.AppName app name. Example 'My App'
         * @param {string} data.AppVersion Example '1.0.1'
         * @param {string} data.Type Log Level. Example 'Debug'
         * @param {Object} data.cData TODO
         */
		,rlog: function(data){
			global.SISLogsRT.publish('SISLogsRT', JSON.stringify(data));
		}


        /**
         * send mail with siss error or any message
         * @memberOf Logs
         * @method sendmail
         * @param  {string} txt     mail body
         * @param  {string} subject mail subject. Default SISS Error
         */
        ,sendmail: function(txt, subject){

            var mail = new SISSCore.Mail()

            mail.send({
                     subject: subject
                     ,text: txt

                 }, function(e){
                     console.log(e);
                 });

        },
        /**
         * save error into collection. 
         * @memberOf Logs
         * @method reportError
         * @param  {string} type   error type. Example "UNKNOWN"
         * @param  {string} pack   package name. Example mws.Me.__._name
         * @param  {string} domain domain. Example TODO
         * @param  {string} msg    body message
         * @param  {string} file   TODO. Example __filename
         * @param  {number} line   TODO
         * @param  {Object} raw    error object. Example err
         */
        reportError :function(type,pack,domain,msg,file,line,raw){
            // ej: Logs.reportError("UNKNOWN",mws.Me.__._name,"dominio","mensaje",__filename,0,err);
            var dataToSave={type:type,pack:pack,domain:domain,msg:msg,file:file,line:line,raw:raw};
            //mongodb.satelites.errors.save(dataToSave);
            //TODO: fire redis event
        },
        /**
         * console.log msg
         * @memberOf Logs
         * @method log
         * @param  {string | object} msg body | message to log
         */
        log : function(msg){

           console.log(typeof msg=="object"?util.inspect(msg):msg);

        },
        /**
         * log msg with debug level. Color Blue
         * @memberOf Logs
         * @method debug
         * @param  {Object | string} msg   msg body | message to log
         * @param  {number} level level number. Example 1
         */
        debug : function(msg,level){
            level=level||1;
            if(_debug){
                if(level<=_debug)
                console.log(clc.blue(typeof msg=="object"?util.inspect(msg):msg));
            }

        },
        /**
         * log msg with error level. Color red
         * @memberOf Logs
         * @method error
         * 
         * @param  {Object | string} msg   msg body | message to log
         * 
         */
        error : function(msg){
            this.printColor('red', typeof msg=="object"?util.inspect(msg):msg);
        }
        /**
         * log ok msg. Color green
         * @memberOf Logs
         * @method ok
         * @param  {Object | string} msg   msg body | message to log
         */
        ,ok : function(msg){
            this.printColor('green', typeof msg=="object"?util.inspect(msg):msg);
        }
        ,info : function(msg){
            this.printColor('yellow', typeof msg=="object"?util.inspect(msg):msg);
        }

        ,printColor: function(color, msg){
            console.log(clc[color](typeof msg=="object"?util.inspect(msg):msg));
        }

};



