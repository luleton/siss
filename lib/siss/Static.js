/**
 * @author Lopez Oscar
 * @since 07/10/2014
 *
 * Objetivo
 * Reemplazar el manejo de archivos estaticos que utiliza express.js
 *
 * 1°  Crear un middleware que detecte mediante una url si se solicita un archivo estatico o no
 * 2°  Si es un archivo estático, se debe detectar su MIME-TYPE y agregarlo en el header del response.
 * 3° Si no es un archivo estático, se debe continuar con el request.
 *  file 4mb > 1 usar streaming con pipes
 *
 *  http://redmine.lync.com.ar:8080/issues/295
 *
 *  Crear la interfaz para servidor contenido estático.

 El mismo sera un mws que sera llamado por el motor R (motor que decide que hacer con un request).

 Si el archivo es físico (corresponda o no a un package o subpackage) se deberá devolver el contenidos.

 Algunos factores a tener en cuenta son:

 - Mime type
 - Size del archivo (si pesa mas de X Mb deberá ser devuelto por técnica de streaming). El limite sera configurado en el sissconf.js
 *
 *
 **/

var mime = require('mime');
mime['default_type'] = 'text/html';

var fs = require('fs');

var _URL = require('url');



module.exports = function(req,res,next){
    var url = req.url;
    //console.log('running Static midd',url);

    var parsedUrl = _URL.parse(url,false,true);

    if(parsedUrl && parsedUrl.pathname && parsedUrl.pathname != '/'){

        var parseRequestURL = function(url, req, res){

          var path = req.module.path.public;


            if(!req.domain.primary){
                url = url.replace(req.module.__._virtualdir, "").replace('//', '/');
            }

            //console.log('procesando: ', url, '  >>> ', path);

            return path+url;
        };
        var urlToServe = parseRequestURL(parsedUrl.pathname,req,res);

        if(!SISSCore.Caronte.fs.existsSync(urlToServe)){
            urlToServe="404.hbs";
        }

        var mimeType  = getMimeType(urlToServe);
        res.setHeader('Content-Type',mimeType);
        if(urlToServe !== '404.hbs'){
            res.sendFile(urlToServe);
        }else{
            var packageViewsFolder = req.paths.view;
            packageViewsFolder+='/404.hbs';
            try{
                var stats = fs.statSync(packageViewsFolder);
                if(stats.isFile()){
                    var f404 = fs.readFileSync(packageViewsFolder);
                    res.set("Content-Type", "text/html");
                    res.status(404).send(f404);
                    return;
                }else{
                    //404 default

                    res.render(__droot__+'/views/'+'404.hbs');
                }
            }catch(err){
                //404 default
                console.log(err);
                res.render(__droot__+'/views/'+'404.hbs');
            }
        }
    }else{
        next();
    }
}

var getMimeType = function(url){
    return mime.lookup(url);
}



