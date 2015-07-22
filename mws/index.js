var mws = module.exports = {
	home: function(req, res, next){
		res.render('home.hbs', {});

	}

	,errorHandler: function(err, req, res, next){
                console.log(err);
                console.error(err.message);
                console.trace();
                Logs.sendmail("SISS Reiniciado sin problemas", "SISS Event: "+console.trace());
                switch (res.statusCode){
                        case 404:
                                next();
                                break;
                        default:
                               // res.redirect(caronte.removeQuery(req.headers.referer || req.url) + '?error=' + err.message);
                                app.set('views', __droot__+'/views');
                               res.render("error.hbs",{layout: null,'message':err.message});
                        break;
                }
        }
	,renderError404: function(req, res){
                res.render('404.hbs');
     }
	  


}