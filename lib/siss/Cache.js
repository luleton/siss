"use strict";

module.exports = function(){
    var _this = this
    this.fs = require('fs');
    this.Caches = {};

    setInterval( function(){
        for(var c in _this.Caches){
            if(new Date().getTime() - _this.Caches[c].created.getTime() >= _this.Caches[c].ttl) {  delete _this.Caches[c]; }
        }
    }, 500);

    /**
     * Retrieves value by key
     * @method get
     * @param {string} key 
     * @return {Object} value
     */
    this.get = function(key, driver){
        var driver = driver || 'memory';
        switch(driver){
            case 'file':
                return _this.getFile(key);
                break;
            case 'memory':
            default:
                if(typeof _this.Caches[key] == "undefined") return false;
                else return _this.Caches[key].data;
                break;

        }

    };

    /**
     * Adds key value to cache by driver (memory, file ...)
     * @method add
     * @param {string} key  key for access
     * @param {Object} value  object to save
     * @param {Number} ttl (time to live) cache time
     * @param {string} driver  is the way the data is stored (memory, file). Default memory
     */
    this.add = function(key, val, ttl, driver){
        var driver = driver ||  'memory';
        switch(driver){
            case 'file': return _this.writeFile(key, val, ttl); break;
            case 'memory':
            default:
                _this.Caches[key] ={ data: val, created: new Date(),ttl: ttl*1000, key: key};
                break;

        }
    };
    /**
     * alias for add method
     * @method add
     * 
     */
    this.set = this.add;

    this.getFile = function(key){
        console.log('exists? : ', _this.fs.existsSync(key));

        if(_this.fs.existsSync(key)) { return _this.fs.readFileSync(key).toString(); }
        else { return false; }
    };

    this.writeFile = function(key, val, ttl){
         _this.fs.writeFileSync(key, val, {falgs:'w'});
    };

};