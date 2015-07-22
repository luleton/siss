"use strict";

var appHTTPS = null;


var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');

var compression = require('compression');
var methodOverride = require('method-override');

global.app = express();

var serverHTTPS = null;

var redis = require("redis").createClient();


global.SISLogsRT = require('redis').createClient();
global.SISEventsToFront  = require('redis').createClient();

SISLogsRT.on("error", function(err) {
    console.error("Redis Service Not Available. Please run command redis-server ", err);
});

SISEventsToFront.on("error",function(err){
    console.log('Redis Service Not Available. Please run command redis-server '+err);
});

var session = require('express-session');
var RedisStore = require("connect-redis")(session);



if(process.env.SESSION_STORE == 'mongo'){
    /*
     *
     * MongoDB Session Storage
     * Se utiliza en los siss de cloudia
     * https://www.npmjs.com/package/connect-mongo
     *
     * Escanea los paquetes que tiene la var _session en el sisspack
     *
     * TODO Ver sessions en múltiples packages dentro de un mismo SISS
     *
     * */
    for(var name in __MODULES__){
        var module = __MODULES__[name];

        if(module.__ && module.__._session){
            var MongoStore = require('connect-mongo')(session);

            var sessionConf = module.__._session;
            //OJO Solo funciona con una estructura especifica de store
            sessionConf.store = new MongoStore(sessionConf.store);
            app.use(session(sessionConf));
        }else{
            console.log('no existe session in ',name);
        }
    }
}else{
    /*Redis Server default for session storage*/
    app.use(session({
        store: new RedisStore({}),
        resave: false,
        saveUninitialized: true,
        secret: 'secreKey for secre Kat'
    }));
}


app.locals.appName = 'SISS 1.4';
app.set('port', global._port);
app.engine('html', SISSCore.Renders.html);
app.set('view engine', 'hbs');
app.use(bodyParser.json({ extended: true, limit:'50mb' }));
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));

app.use(multer({ dest: './uploads/'}));

app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(compression());



app.use(SISSCore.compatible);
app.use(SISSCore.cross);
app.use(SISSCore.realip);
app.use(new SISSCore.Packages().postloads);
app.use(SISSCore.runRegisteredsMWS);
app.use(SISSCore.checkVirtualHost);
app.use(SISSCore.Static);



console.log("cargando el router Magico >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
SISSCore.Caronte.routeMapper(__dirname + '/routes');

global._port=args['-port'] || 80;


/**
 * HTTPS ENABLED (?)
 */

var httpsEnabled = args['-https'] || false;
var httpsKey = args['-key'] || false;
var httpsCrt = args['-crt'] || false;

if(httpsEnabled!=false && httpsKey!=false && httpsCrt!=false){
    var privateKey  = fs.readFileSync(httpsKey, 'utf8');
    var certificate = fs.readFileSync(httpsCrt, 'utf8');

    var credentials = {key: privateKey, cert: certificate};
    console.log("HTTPS ENABLED!!! credentials: ", credentials);

    global.appHTTPS = app;

    var callbackHTTPSRequest =function(req, res){
        res .writeHead(200);
        res.end("hello world\n");

    };

    serverHTTPS = https.createServer(credentials, appHTTPS).listen(8000);
    console.log("SISS with HTTPS listening on: ", 443);


}else{
        var listenIF="0.0.0.0";

        if(args['-interface']){
            listenIF=args['-interface'];  
        }

        var server = app.listen(_port,listenIF, function () {

                var host = server.address().address;
                var port = server.address().port;

                console.log("app: ", app, "appHTTPS: ", appHTTPS);
                console.log("SISS listening on: ", host, port);

            });

}//no https server

SISSCore.appHTTPS = appHTTPS;
SISSCore.app = app;
