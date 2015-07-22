/**
 * prototype module for loading libs (/lib folder).
 *
 * This is used on __init__ method from packages in order to load any lib.js
 * 
 * @type {Object}
 */
module.exports = {
	/**
	 * Load library 
	 * @param  {string} lib    lib filename (lib.js)
	 * @param  {string} module module name or package name
	 * @return {Object} module object with libs methods
	 */
	load : function(lib, module){
		var module = module || '';
		var file  = "";
		console.log('Load lib:  ', lib);
		if(module=='') {
			file  = __droot__+'/lib/'+lib;
		}
		else {
			var file  = module.path.lib+'/'+lib;
		}//end else

		return require(file);

	}
	,fire: function(){
		//console.log(this);
		//SisCore.emit()
	}
    ,send: function(data, res){var _this = this; SISSCore.send(data, res, _this.Me.__) }
    ,json: function(data, res){var _this = this; SISSCore.json(data, res, _this.Me.__) }
    ,render: function(view, data, res, htmlcb){
        var _this = this;
        var htmlcb = htmlcb || null;
        app.set('views', "/");


        data.layout = typeof data.layout == "undefined"  ?  _this.Me.path.view+"/"+"layout" : data.layout;


		if(typeof _this.$_getLanguages !=="undefined"){
			SISSCore.render(_this.Me.path.view+"/"+view, data, res, _this.Me, function(err, html){
				if(err) html = err;
				_this.$_getLanguages(res, html, _this.Me.path.view+"/"+view);
			});
		}else{
			SISSCore.render(_this.Me.path.view+"/"+view, data, res, _this.Me, htmlcb);
		}



    }

	/**
	 * Map on to SissCore.on
	 * @type {Function}
	 */
	,on: SISSCore.on
};