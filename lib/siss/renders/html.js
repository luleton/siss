
/**
 * Read a file and return its contents by callback
 *
 * This method is used in express.js for html engine
 *
 * @memberOf SISSCore
 * @method noRender
 *
 * @param  {string}   path    file path
 * @param  {Object}   options Not implemented yet
 * @param  {Function} cb      callback to run with content data
 */
module.exports =  function(path,options,cb){
    var fs=require("fs");
    if(fs.existsSync(path)){
        var content=fs.readFileSync(path);
        if(content){
            cb(null,content.toString());
        }else{
            cb(null,"");
        }
    }else{
        cb("Template not found",null);
    }
};

