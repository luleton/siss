
var UglifyJS = require("uglify-js");
var uglifycss = require('uglifycss');

var fs=require("fs");

module.exports = {

    path: '',

    setPath : function(path){
        this.path=path;
    },


    minJSFiles : function(outputFileNamePath, inFiles,cb){ 
         
        SISSCore.Logs.debug("INIT minFiles");
        this.minFiles(outputFileNamePath, inFiles, 'JS',cb);

    },

    minCSSFiles : function(outputFileNamePath, inFiles, cb){ 
         
        SISSCore.Logs.debug("INIT minCSSFiles");
        this.minFiles(outputFileNamePath, inFiles, 'CSS',cb);
        
    },

    minFiles : function(outputFileNamePath, inFiles, type,cb){

        var me=this;
        if(this.path){
           inFiles= inFiles.map(function(file){
                return me.path+file;
            });
        }

        try{
            if(type=="JS"){

                var result = UglifyJS.minify(inFiles, {});
                result.code=result.code.replace('"use strict";','');

            }else{

                var cssmin = uglifycss.processFiles(
                    inFiles,
                    { maxLineLen: 500, expandVars: false, uglyComments:true, cuteComments:true }
                );
                var result={code:""}
                result.code=cssmin;
                //console.log(cssmin);
            }
            
            if(me.path) outputFileNamePath=me.path+outputFileNamePath;

            console.log(outputFileNamePath);
            fs.writeFileSync(outputFileNamePath, result.code, {encoding:'utf8'} );

        }catch(e){
            SISSCore.Logs.error(e);
            if(typeof cb=="function")
            cb(e,null);
            return;
        }

        if(typeof cb=="function")
        cb(null,result.code);
       
    }
	

};