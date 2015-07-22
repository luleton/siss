/**
 * SISS use redis for several reasons. 
  - Socket.io Support
  - User Sessions
  - Real time logs for internal process
  - Communication between app and process
 * @namespace Console
 * @param  {Object} redisConsoleOutput  redis client using for publish data
 * @example
 * send: function(data){
		redisConsoleOutput.publish(secretOutputChannel, JSON.stringify(data));
	}
 * @param  {Object} secretChannelOutput secretChannelOutput
 */
module.exports = function(redisConsoleOutput, secretChannelOutput) {

	var _this = this;
	
	
	this.redisConsoleOutput = redisConsoleOutput || false;
	this.secretChannelOutput = secretChannelOutput || 'NoData';
	
	console.log('Init remote console');
	
	var SISSPackages = require(__droot__+'/lib/siss/Packages');
	this.SISSPackages = new SISSPackages();


	/**
	 * This method receive a command in order to run.
	 * 
	 * run execute data as javascript function.
	 * show execute _this.show method. See show method.
	 * package execute _this.SISSPackage.process
	 *
	 * 
	 * 
	 * @memberOf Console
	 * @method process
	 * @param  {Object} data object with command to run and require data to show
	 * @param {string} data.cmd command to run
	 * @param {Object} data.data data to eval, send or process
	 */
	this.process = function(data){
		var _this = this;
		
		console.log('Remote command: ', data);
		switch(data.cmd){
			case 'run':
				try{
					var str = data.data.join(' ');
					eval(str);
				}catch(e){ console.log('fnc error from console: ', e); }
				break;
			
			case 'show':
				_this.show(data);
				break;
			case 'package':
            case 'pkgadmin':
					_this.SISSPackages.process( data);
				break;


		}//end switch
	}; //end process

	/**
	 * List Hardware information from Current Server 
	 * 
	 * @memberOf Console
	 * @method hardware
	 */
    this.hardware = function(){
        var res = {};
        res['hostname'] = SISSCore.os.getHostName();
        res['arch'] = SISSCore.os.getArch();
        res['cpu'] = SISSCore.os.getCPUS();
        res['memory'] = SISSCore.os.memStats();
        res['interfaces'] = SISSCore.os.getInterfaces();
        res['os'] = SISSCore.os.getOS();

        this.send(res);

    };
	/**
	 * publish data via redisConsoleOutput
	 * @memberOf Console
	 * @method send
	 * @param  {Object} data data to publish. This is converted to json string
	 */
	this.send =  function(data){
		var _this = this;
		if(_this.redisConsoleOutput!==false) _this.redisConsoleOutput.publish(_this.secretChannelOutput, JSON.stringify(data));
	};
	/**
	 * [show description]
	 * @memberOf Console
	 * @method show
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.show = function(data){
		var second = data.data.length > 1 ? data.data[1]: '';
        var res = [];

        var _showModules = function(type){
            for(m in __MODULES__) {
                if( ('__' in __MODULES__[m]) && (__MODULES__[m].__._type==type) ) res.push(__MODULES__[m].__);
            }//end for
        };

		switch(second){
			case 'web': _showModules('web'); break;
			case 'cron': _showModules('cron'); break;
            case 'native': _showModules('native'); break;
            case 'api': _showModules('api'); break;
            case 'core': _showModules('core'); break;
            case 'system': _showModules('system'); break;
            case 'all': for(m in __MODULES__) res.push(__MODULES__[m].__); break;
            case 'routes': res.push(global.MainMAP); break;
            case 'hardware': this.hardware(); break;
            case 'domains': res.push(__DOMAINS__); break;
            case 'primaries': res.push(__PRIMARYDOMAINS__); break;
		}//end switch

        _this.send(res);
	};
	
	/**
	 * Register event to send message via redis channel.
	 * @event rconsoleMsg
	 * @param  {string} msg message to send via redis
	 */
	SISSCore.on('rconsoleMsg', function(msg){
			_this.send(msg);
	});
	
};