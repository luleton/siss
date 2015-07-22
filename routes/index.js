var dir = __droot__+'/mws';
var mws = require(dir);


var MainMAP = {
        '*':{
				
                get: [function(req, res, next){

                        if(req.url.match(/^\/(login|stylesheets|javascripts|images|favicon)/)) return next();
						else{
							req.bymethod="GET";
							Logs.track(req);

                            next();
                        }//end else
                }//end function

                ]
                ,post:[function(req, res, next){
                        req.bymethod="POST";
                                Logs.track(req);
                                next();
                }]
                ,put: [function(req, res, next){
                        req.bymethod="PUT";
                        Logs.track(req);
                        next();
                }]
                ,delete: [function(req, res, next){
                        req.bymethod="DELETE";
                        Logs.track(req);
                        next();
                }]
        },//end get
        '/': {
                get: [mws.home]
				,post: [mws.home]
                ,delete: [mws.home]
                ,put: [mws.home]
        }


		
};

SISSCore.getRouting(MainMAP,'core');
SISSCore.getRouting(MainMAP,'web');
module.exports = global.MainMAP = MainMAP;
SISSCore.fusionPaths();