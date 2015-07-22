/**
 * Transaction module. This creates random keys.
 * @namespace Transaction
 * @type {Object}
 */
module.exports = {
	/**
	 * generate hashed random key for uniqueness
	 * @return {string} hashed key
	 */
	generateKey: function(){
		var t=(Math.random() + new Date().getTime())+'_';
		return SISSCore.Caronte.sha1(t);
	}
};
