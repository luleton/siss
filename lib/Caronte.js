  
  var fs = require('fs'),
        mkdirp = require('mkdirp'),
        crypto = require('crypto'),
        url = require('url');
  var http = require('http');


require(__droot__+'/lib/caronte/Date');
require(__droot__+'/lib/caronte/Array');
require(__droot__+'/lib/caronte/Object');

var caronte = module.exports = {

        Object: {
            isArray: function(o){ return Object.prototype.toString.call( o ) == "[object Array]" ? true: false; }
            ,isObject: function(o){ return Object.prototype.toString.call( o ) == "[object Object]" ? true: false; }
            ,isFunction: function(o){ return Object.prototype.toString.call( o ) == "[object Function]" ? true: false; }
            ,isString: function(o){ return Object.prototype.toString.call( o ) == "[object String]" ? true: false; }

            ,findKey: function(obj, key){
                var found = false;
                  var _findKey = function(obj, key){
                      for(var o in obj){
                          if(o == key) { found = obj[o]; }
                          else if(SISSCore.Caronte.Object.isObject( obj[o]))  _findKey(obj[o], key);
                      }//end for
                      return found;
                  };

                return _findKey(obj, key);
            }//end findKey



            ,union: function(target, source){
                for(var o in source){
                    target[o] = source[o];
                }//end for
            }//end UNION


            ,$transformToTable: function(obj){
                matrix = [];

                var _do2 = function(obj, stack){
                    for (var property in obj) {

                            if (SISSCore.Caronte.Object.isObject(obj[property])) {
                                _do2(obj[property], stack + property);
                            } else {

                                stack = stack.replace("//", "/");
                                if(stack=='/') var segments = ['/'];
                                else{
                                    var segments = stack.split('/');
                                    if(segments[0]=="") segments = segments.slice(1);
                                }//end else
                                segments.push(property);
                                segments.push(obj[property]);
                                matrix.push(segments);
                            }//end else
                        //}//end if loco
                    }//end for
                };

                _do2(obj, '');

                return matrix;
            }//end method $near

        }//end Object
        ,interpolate: function(x0, x, y){
                return y[0] + (x0 - x[0]) * (y[1] - y[0]) / (x[1] - x[0]);
        },

        removeQuery: function(url){
                var     idx = url.indexOf('?');
                if (idx === -1){
                        idx = url.length;
                }
                return url.substring(0, idx);
        },
		fileName: function(fullPath){
			var pars = fullPath.split('/');
			if(pars==0) return '';
			else return pars[pars.length-1];
		},

        routeMapper: function(file){
                app.map = function(a, route){
                        route = route || '';
                        for (var key in a) {
                                if (_.isFunction(a[key]) || _.isArray(a[key]) || _.isString(a[key])){
                                        app[key](route, a[key]);
                                }else if (_.isObject(a[key])){
                                        app.map(a[key], route + key);
                                }
                        }
                };
                app.map(require(file));
        },
		removeMap: function(key){
			(function(){
				for(var x=0; x<app.routes.get.length; x++){
					var r=app.routes.get[x];
					if(r.path.indexOf(key)==0) {
						//delete app.routes.get[x];
						//app.routes.get[x].path='xxxxxxxxxx';
					}
					
				}//end for
			})();
			

			
		}
		,serial: function(firstFn){
                var pendingFunctions = [];
                var next = function(){
                        var removedFn = pendingFunctions.shift();
                        var args = Array.prototype.slice.call(arguments);
                        if (pendingFunctions.length){
                                args.push(next);
                        }
                        removedFn.apply(this, args);
                };
                var self = {
                        done: function(finalFn){
                                process.nextTick(function(){
                                        firstFn(next);
                                });
                                return self.then(finalFn);
                        },
                        then: function(fn){
                                pendingFunctions.push(fn);
                                return self;
                        }
                };
                return self;
        },
		  countdown: function(counter, next){
					var args = {};
					return function(obj){
							counter -= 1;
							_.extend(args, obj);
							if (counter === 0){
									next(_.isEmpty(args) ? null : args);
							}
					};
			},

     fs: {
                exists: function (dest, cb) {
                        fs.stat(dest, function (err, s) {
                                cb(!err);
                        });
                },
                readSync :  function(path){
                        return fs.readFileSync(path).toString();
                 },
                existsSync : function(path){ return fs.existsSync(path);},
                getFiles: function(dir, cb){
                        var self = this;
                        self.exists(dir, function(exists){
                                if (exists){
                                        fs.readdir(dir, function(err, files){
                                                if (err) throw err;
                                                cb(files);
                                        });
                                }else{
                                        cb([]);
                                }
                        });
                },

				mkdir: mkdirp,
                mkdirSync: fs.mkdirSync,
                copySync: function(origen, destination){
                    var fcontent = fs.readFileSync(origen, {encoding: null, flag: 'r'});
                    fs.writeFileSync(destination, fcontent, {encoding: 'utf8'});

                },
                rename: function(old_path, new_path, cb){
                        var self = this,
                                rename = function(){
                                        fs.rename(old_path, new_path, function(err) {
                                                if (err) throw err;
                                                cb();
                                                // fs.unlink(old_path, function(err) {
                                                //      if (err) throw err;
                                                //      cb();
                                                // });
                                        });
                                };
                        self.exists(new_path, function(exists){
                                if (exists){
                                        fs.unlink(new_path, function(err){
                                                if (err) throw err;
                                                rename();
                                        });
                                }else{
                                        rename();
                                }
                        });

                },

				removeFiles: function(files, dir, cb) {
                        var len = files.length,
                                next = utils.countdown(len, cb);
                        if (len === 0){
                                cb();
                        }else{
                                files.forEach(function(file){
                                        fs.unlink(dir + '/' + utils.trim(file), function(err){
                                                if (err) throw err;
                                                next();
                                        });
                                });
                        }
                },
                upload: function (file, dest, cb){
                        var self = this;
                        if (file && file.size){
                                var tmp_path = file.path,
                                        new_path = dest + '/' + file.name;
                                self.exists(dest, function(exists){
                                        if (exists){
                                                self.rename(tmp_path, new_path, cb);
                                        }else{
                                                self.mkdir(dest, function(err){
                                                        if (err) throw err;
                                                        self.rename(tmp_path, new_path, cb);
                                                });
                                        }
                                });
                        }else{
                                cb();
                        }
                }
         ,download: function(url, filename, destination, callback){
                var filename = filename || caronte.fileName(url);
                var destination = destination || '/tmp';

                var newfile = fs.createWriteStream(destination+'/'+filename);
                if(url.indexOf("https://")>-1){
                    var request = require("https").get(url, function(response) {
                        var save =  response.pipe(newfile);
                        callback(save);
                    });
                }else{
                    var request = http.get(url, function(response) {
                        var save =  response.pipe(newfile);
                        callback(save);
                    });
                }


         }//end download method

         ,getExtension: function(filename){
            var filename = filename || "none.xxx";
            parts = filename.split(".");
             return parts[parts.length-1];
         }

         ,getFile: function(path, pipe){
                var path = path || '';
                fs.createReadStream(path).pipe(pipe);
         }
        },//end fs object

		
		   is: {
                alpha: function(value){
                        return (/^[a-zA-Z]+$/).test(value);
                },
                alphanumeric: function(value){
                        return (/^[a-zA-Z0-9]+$/).test(value);
                },
                bool: function(value){
                        return (/^[0|1]$/).test(value);
                },

                date: function(value){
                        return (/^(0[1-9]|[12][0-9]|3[01])[\- \/.](0[1-9]|1[012])[\- \/.](19|20)\d\d$/).test(value);
                },

                email: function(value){
                        return (/^[_a-z0-9\-]+(\.[_a-z0-9\-]+)*@[a-z0-9\-]+(\.[a-z0-9\-]+)*(\.[a-z]{2,4})$/).test(value);
                },
                 number: function(value){
                                    return (/^\d+$/).test(value);
                            },
                par: function(value){
                        return value % 2 === 0;
                },
                impar: function(value){
                        return value % 2 === 1;
                }
            },
        sha1: function(val){ return crypto.createHash('sha1').update(val || '').digest('hex'); }
        ,md5: function(val){ return crypto.createHash('md5').update(val || '').digest('hex')}
        ,trim: function(string) { return string.replace(/^\s*|\s*$/g, '');}



};




