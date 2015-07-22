/**
 * Module for Hardware Information
 * @namespace OS
 */
module.exports = {
    os : require("os")
    /**
     * @memberOf OS
     * @method getOS
     */
    ,getOS :    function(){ return this.os.platform(); }
	/**
	 * @memberOf OS
	 * @method getArch
	 */
    ,getArch:   function(){ return this.os.arch() }
    /**
     * @memberOf OS
     * @method memStats
     */
    ,memStats:  function(){ return {total: ( (this.os.totalmem()/1024) / 1024), free: ( (this.os.freemem()/1024) / 2014) }; }
    /**
     * @memberOf OS
     * @method get CPUS
     */
    ,getCPUS:    function(){ return this.os.cpus();}
    /**
     * @memberOf OS
     * @method getInterfaces
     */
    ,getInterfaces: function(){ return this.os.networkInterfaces(); }
    /**
     * @memberOf OS
     * @method getHostName
     */
    ,getHostName: function(){ return this.os.hostname();}
    ,run: function(cmd, callback){

    }
};