module.exports = function(req, res, next){


    var msgDeprecated = function(o){
        //SISSCore.Logs.info('SISSCore deprecated '+o+' but is created 4u');
    }

    SISSCore.defineGetter(req, 'host', function(){
        msgDeprecated('req. host');
        return req.hostname;
    });

    next();
};