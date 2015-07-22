/**
 * Collections Utils. 
 *
 * Use this if you need to deal with collections.  
 * 
 * @module Collections
 * @since  1.2
 * 
 */
function Collections(){
	
	var _this = this;
	/**
	 * 
	 * @var {Object} Collections object. Store all elements. 
	 */
	this.Collections = {};
	/**
	 * Increment +1 a position. If doesn't exists, create position, else inc
	 * @param  {number | string} key access to object
	 * 
	 */
	this.inc = function(key){
		if(!_this.exists(key)) _this.Collections[key] = 0;
		_this.Collections[key]++;
	};
	
	/**
	 * Decrement -1 a position. If doesn't exists, create position with 0;
	 * @param  {number | string} key access to object
	 */
	this.dec = function(key){
		if(!_this.exists(key)) _this.Collection[key] = 1;
		_this.Collections[key]--;
	};
	/**
	 * ask if contains key
	 * @param  {number | string} key access to object
	 * @return {boolean} if exists
	 */
	this.exists = function(key){
		return !!_this.Collections[key]; 
	};
	/**
	 * add val to array with specified key. If key exists, replace value
	 * @param {number | string} key access to object
	 * @param {object | string | number} val value to set
	 */
	this.add = function(key, val){
		if(!_this.exists(key)) _this.Collection[key] = null;
		_this.Collections[key] = val;
	};
	/**
	 * get element from Collections object
	 * @param  {number | string} key access to object
	 * @return {Object} return value by key
	 */
	this.get = function(key){
		return _this.Collections[key];
	};
	/**
	 * remove object from Collections
	 * @param  {number | string} key access to object
	 */
	this.del = function(key){
		delete _this.Collections[key];
	}
	/**
	 * return all elements from Collections objects
	 * @return {Object} Collection object
	 */
	this.getAll = function(){ return _this.Collections }
};

module.exports = Collections;
