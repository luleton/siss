
SISS
==================

>SISS (Sistema Integral de Soluciones Satelitales) es un servidor de aplicaciones construido con Node.js + Express.js con soporte de datos en MongoDB y Redis.

>* Permite correr otras aplicaciones (packages) en forma controlada interconectando señales y tareas. 
>* SISS unifica y establece patrones y protocolos de trabajo, como así también fuentes de datos en común.
>* La solución ofrece la capacidad de construir packages que se unan al conjunto de soluciones, cada uno de ellos independiente.

### **SISS se divide en SISSCore y Packages** ###


**El objeto SISSCore esta disponible en todo el ambiente SISS.** Es una variable global con la instancia principal de SISS que aporta una serie de herramientas (métodos, utiles, manejo de logs, series, virtual hosts ) para ser utilizadas en los packages.

## [sisscore.js](SISSCore.html) ##
exporta el objeto SISSCore. Herramientas disponibles en todos los packages.
Con este podemos crear e invocar eventos, realizar request http/s, enviar json via express, manejar el render de layouts (express.js) y manipular transacciones.
### Métodos ###

#### [on](SISSCore.html#on) ####
El método on nos permite escuchar sobre un evento. Pasamos dos argumentos, el nombre del eventos y el callback del mismo.
``` 
{@lang javascript}
SISSCore.on('myEvent',function(){
		//My Implementation
	})
```

#### [emit](SISSCore.html#emit) ####
El método emit permite detonar un evento. Pasamos como argumento el nombre del evento.
``` 
{@lang javascript}
SISSCore.emit('myEvent');
```

#### [removeAllListeners](SISSCore.html#removeAllListeners)
Elimina todos los listers de un evento (todos sus callbacks asociados). 

#### [fire](SISSCore.html#fire)
Es un alias de emit.

#### [json](SISSCore.html#json)
Envía al buffer de salida el object json que pasemos. Espera dos argumentos, el object a enviar y el object RES.
``` 
{@lang javascript}
		//req, res, next from express.js
		saveCollection: function(req, res, next){
            var save = {
              	tid: req.body.params.tid || 'noTID'
                ,data: req.body.params.data || {}
            };

            mws.Me.mongodb.collection.save(save, function(err, response){
                    SISSCore.json(response, res);
            });

        }
```

#### [send](SISSCore.html#send)
Envía el string que pasamos como primer argumento al object RES especificado en el segundo argumento.

#### [render](SISSCore.html#render)
Es el método encargado de hacer un render de una vista en el navegador. Espera 3 argumentos: la vista, la data y el object RES.
``` 
{@lang javascript}
		//res object from express.js
		SISSCore.render(mws.Me.path.view+'/index.hbs', {
							data: stats
							,countSales: totalVentas
							,websites: mws.WebSites
							,localWebsite : params.Website
							,localFrom : iniF.Day+'/'+iniF.Month+'/'+iniF.Year
							,localTo : endF.Day+'/'+endF.Month+'/'+endF.Year
							,total: totalFee.toFixed(2)
							,viewsPath: mws.Me.path.view
							,url: req.url.indexOf('?') == -1? req.url+'/?' : req.url
                            ,General: true
                            ,mws:mws
						}, res);
		}//end else
```

#### [spooler](SISSCore.html#spooler)
Almacena información en una collection de mongo asociada a un tid (transaction ID).
Espera 3 argumentos: data object, driver mongo, tid 
``` 
{@lang javascript}
		_this.Desp.search(req.query, function(err, data){
                var fdata = {results: data, provider: 'despegar'}

                if(req.query.showDespegar=="true"){
                    SISSCore.json(fdata, res)
                }

				SISSCore.spooler(fdata, mws.Me.mongodb, req.Transaction.tid, function(){
                    SISSCore.emit(evtSearch, [], 'despegar');
                });

			}); //end search despegar
```

#### [request](SISSCore.html#request)  ####
Este método ejecuta un request hacia una url http o https.
Usa dos argumentos, el primero es un object con las options necesarias, el segundo es el callback.
``` 
{@lang javascript}
		this.search = function(val, callback){
        var _this = this;

        var RequestOptions = {
            host: 'www.decolar.com'
            ,path: _this.pathCities+val+"&_="+new Date().getTime()
            ,port:80
            ,method: 'GET'
            ,headers :{
                'Accept':'application/json'
                ,'Accept-Encoding': 'gzip, deflate'
                //,'X-ApiKey': key
                //,'X-Language': language
            }
        };

        SISSCore.request(RequestOptions, callback);

    };
```

## Libs ##

### [Collection.js](module-Collections.html)
exporta el objeto Collections. Es utilizada internamente por Siss como herramienta para almacenar listas de key’s con propósitos de contadores o simplemente listados clave/valor.

### [Console.js](Console.html)
Manejo de eventos y mensajes via canales redis. Este util posee la forma de enviar y procesar mensajes de redis.
Siss utiliza redis por varias razones. 
	* Soporte Socket.io
	* Sesiones de usuarios
	* Logs en tiempo real para procesos internos
	* Comunicación entre procesos y aplicaciones

### [Transactions.js](Transaction.html)
exporta el objeto *Transaction*. Sirve para manipular Tx. Por ejemplo, crear random keys hasheadas.(SHA1)

### [packages.js](module-packages.html)
Manejo del sistema de packages. Construcción, validaciones, manejo de dominios y módulos.

### [prototypes.js]()
Sirve para la carga de libs en los packages. Es usado por el método __init__ de cada package(obligatorio para cada uno)

### [vhosts.js](module-vhost.html)
vhosts maneja la lógica que relaciona los dominios y packages. Ya sean reales o virtuales, PRIMARY o no. Públicos y privados. Provee una forma de administrar los paths de la aplicación. 

### [Users.js](Users.html)
exporta el objeto *Users* Manejo de utilidades para control de usuarios. Por ejemplo login y registro

### [Series.js](/Series.html)
exporta el objeto *Series* Util para ejecutar un stack de funciones javascript con sus argumentos.

### [caronte.js]()
Librería con métodos utiles de uso general, no está documentada por ser una especie de framework. Se puede realizar manejo de archivos, manipular fechas,etc. Ver caronte.js ante cualquier duda

### [db.js](db.html)
exporta el objeto *db* para paginado de consultas SQL

### [hbs.js]()
registra todos los helpers para el manejo de templates html basados en handlebars.js para express.js

### [mongodb.js](mongodb.html)
exporta el objeto mongodb. Inicia la conexión a mongodb teniendo en cuenta ciertas collections por default. 

## Siss Console (SISSC)
>SISS cuenta con una consola de administracion que permite instalar paquetes,ver logs, ejecutar código remoto, etc.
La consola (SISS Console o SISSC) se comunica con SISS por medio de 2 canales de Redis dinámicos. los mismos son creados cuando SISS es iniciado y son informados por mensaje en pantalla.
Sin los dos tokens (los canales I/O) no podremos operar sobre SISS, asi que es importante contar con ambos datos.
>

### Comandos ###
Para operar contra SISS se utilizan comando que son proporcionados por la consola.
El sistema SISS tiene comandos internos básicos para instalar paquetes, ejecutar código, etc.
En caso de necesitar comandos especiales se pueden desarrollar modulos que los soporten, solo deben suscribirse a los canales dinámicos y capturar las señales.

#### run
Ejecuta código javascript directamente en el runtime de SISS.
PELIGRO: el mal uso de este comando detona problemas inesperados.

#### package
El comando package es el que permite instalar, actualizar, eliminar, desactivar o activar un paquete dentro de SISS.
Los paquetes son levantados al inicio de SISS, pero es posible bajarlos o levantarlos en runtime.

#### install
instala uno o más paquetes.
Su forma de uso es: package install package1 package2 packageN...
Se auto ejecuta la opción “enable” para este paquete.
update
Actualiza uno o más paquetes
Uso: package update package1 package2 packageN…
Por cada paquete se auto ejecuta “disable” y “enable” para recargar los paquetes.

#### delete
Elimina un paquete instalado.
Se auto ejecuta disable.

#### disable
Desactiva paquetes. Cuando se desactiva un paquete el mismo es eliminado del mapping de rutas de SISS, es eliminado de la super global __MODULES__ y todas sus librerías son destruidas en memoria.

#### enable
Activa paquetes. 
Se ejecuta el proceso tradicional (como si SISS se estuviera iniciando) para este paquete.

#### build
Crear un paquete. Buscará el archivo .js con el nombre del paquete dentro de {SISS}/packages.
Buscará las libs, mws, routes y views de dicho paquete y generará una estructura completa en {SISS}/build/{packageName}
Con dicho paquete construido deberemos crear un script de instalación, etc.

## Packages ##

>Un package en SISS es un conjunto de archivos y directorios que deben cumplir un estandar. Un package puede ser un sitio web, un directorio virtual, un servicio de API, un transporter (ver más adelante), un cron y otros tipos.
Cada package en SISS debe contar con su archivo maestro llamado *“sisspack.js”*.
Este contiene todos los datos del package
>
**La configuracion del módulo deberá ser exportada como módulo**

``` 
{@lang javascript}
module.exports = {
       {  
   '_name':'geo',
   '_version':'1.0.0',
   '_type':'api',
   '_virtualdir':'geo',
   '_mysql':{  
      connection:{  
         user:'satelites',
         password:'satelites',
         host:'mysqlserver.aws',
         database:'satelites'
      },
      '_mongodb':{  
         connection:{  
            connection:'mongodb://mongo.aws/geo'
         },
         collections:[  
            'airports',
            'cache',
            'logs',
            'searchs',
            'countries',
            'cities'
         ]
      },
      '_transactions':false,
      '_domains':[  
         'misite1.com',
         '127.0.0.1',
         'othersite.com'
      ],
      '_conf':{  
         myProperty:'my value''
      }
   }   ;

```


>El objeto debe respetar las propiedades que se observan (si es que requerimos de alguno de los servicios, como mysql, mongo, etc).
Si deseamos agregar propiedades extras, simplemente las ponemos al final de la propiedad _conf.

Si deseamos crear un módulo nuevo o app para SISS es necesario seguir los siguientes guidelines.

* Las librerías van dentro de {$dirPackage}/lib/
* Las vistas van dentro de {$dirPackage}/views/
* Las implementaciones van dentro de {$dirPackage}/mws/
* El mapeo de rutas van dentro de {$dirPackage}/routes/
* Los archivos estaticos (si nuestro package es del tipo web o flow) van dentro de {$dirPackage}/public/

**Recordar que el módulo será invocado por SISS en base al nombre del mismo pasado como el primer directorio, al menos que se le declaren dominios.**

### Tipos de Packages###
>Hay 3 tipos de packages principales: API, WEB y CRON. 

#### Web
El tipo de package web puede ser un directorio virtual asociado a todos los dominios que gestiona el sistema en general o una pagina web “dedicada” asociada a uno o más dominios.
Cuando se declara un tipo web es necesario contar con el folder “public” y “view” en el interior del package.

*  **HTML/Views**
** Includes de views **
Dentro de una view podemos incluir otras views, para ellos usamos
{{include “laotraview”}}
El único requisito es enviar la var 
``` 
{@lang javascript}
		viewsPath: mws.Me.path.view
```
dentro del objeto pasado al render.

#### Transport
Este tipo de package es virtual, se utiliza para redireccionar el tráfico de un servicio de API o Web hacia otra instancia de SISS.
Actúa como un proxy.

#### API
Indicamos que nuestro package ofrece servicios REST.
SISS en estos casos nos brinda herramientas como “transacciones” y demás mecanismos de control.

Es una app dentro de SISS. Realiza el mapeo hacia los módulos(otras apps) que realizan tareas como búsquedas, cálculos, etc. El output normal de estas apps que componen al API es una base de datos en Mongo, solo se devuelven resultados si se consulta al sistema de Transacciones.

Es importante leer bien las propiedades y herramientas disponibles para crear servicios de API, los métodos de seguridad, etc.

* **Transactions**
Todas las operaciones que requieran un diálogo contra el servicio API deberán ser encapsuladas bajo una transacción.
Las transacciones se inician automáticamente, por ejemplo cuando se hace una búsqueda de vuelos, el sistema retornara de forma inmediata un hash que identificará a esa transacción.
El hash es almacenado en “req.Transaction”.

Para poder ver los resultados asociados a un tid (transaction id) la url a usar será algo como el estilo:
>** /api/fsearch/?tid=e273e4e5ee7d664b638ce8a65b4ae5e24e9ab4d3 **

** Ejemplo MWS(Middleware) **
``` 
{@lang javascript}
		var mws = module.exports = {
		__init__: function(){
			var _this = this;
			_this.__SIS__.load('skyscanner', _this.Me);
			
		}
		
      ,'search': function(req, res, next){
		response = {};
		var _this = mws;	
		
		if(typeof req.Transaction!='undefined'){
			console.log('Transaction: ', req.Transaction.tid);
			
			
			_this.Sky = new Skyscanner();
			_this.Sky.search(req.query, function(err, data){
				SisCore.spooler(data, mws.Me.mongodb, req.Transaction.tid);
			}); //end search sky
			
			SisCore.json(req.Transaction, res);
			
		}//end if hay transact for operation
		
		if(req.query.tid) _this.getResults(req, res);
		
	  }//end search
	  ,getResults: function(req, res){
		var _this = mws;
		if(req.query.tid){
			SisCore.getTransaction(mws.Me.mongodb.transactions, req.query.tid, function(err, docs){
				if(err){ console.log(err); SisCore.json({error: err}, res); }
				else{
					SisCore.json(docs, res);
				}
			});
			
		}else{
			SisCore.json({}, res);
		}//end else
	  }
};

mws.__proto__ = require(__MODULES__.SIS.path.mws+'/index');
```

Debe contar con la siguiente definición: *_mongodb* (connection and collections).
``` 
{@lang javascript}
		module.exports = {  
		   '_name':'fsearch',
		   '_version':'1.0.0',
		   '_type':'api',
		   '_virtualdir':'fsearch',
		   '_mongodb':{  
		      connection:{  
		         '_host':'mongo.aws',
		         '_port':'27017',
		         '_database':'satelites'
		      },
		      collections:[  
		         'transactions',
		         'logs'
		      ]
		   },
		   '_transactions':true
		};
```

** Cache y control **
** API ** cuenta con un mecanismo de cache automático.
Cada vez que hacemos un request hacia api el mecanismo de cache tomará la decisión de si debe ejecutar las operaciones solicitadas o devolver el resultado almacenado internamente.
El cache se hace por medio de RedisDB.
https://npmjs.org/package/cache-manager

#### CRON
Permite crear procesos que deberán ser ejecutados cada X cantidad de tiempo.
Tienen acceso al core de SISS y sus herramientas.

Un tipo de módulo dentro de SISS es el **type:cron**
El mismo no es más que una rutina a ejecutar en un tiempo dado.
``` 
{@lang javascript}
		module.exports ={  
		   '_name':'snapgeo',
		   '_version':'1.0.0',
		   '_type':'cron',
		   '_timer':30,
		   '_virtualdir':'__',
		   '_mongodb':{  
		      connection:{  
		         '_host':'mongo.aws',
		         '_port':'27017',
		         '_database':'geo'
		      },
		      collections:[  
		         'airports',
		         'cache'
		      ]
		   },
		   '_transactions':false,
		   ’_enabled’:true
		};
```

En el MWS deberemos crear obligatoriamente el método “run”, que es el se ejecutará cada N segundos (tiempo definido en la propiedad _timer).

Desde la consola podemos ver los crons corriendo ejecutando:
``` 
{@lang bash} show cron
```


#### Preload
Los módulos preload son módulos especiales que serán ejecutados antes de la llamada a un módulo X. Esto quiere decir que si por ejemplo desarrollamos un módulo del tipo API que recibe como argumento un json, procesa y da un resultado pero sabemos que un consumidor envía XML, podemos crear un módulo Preload que transforme el XML a JSON.
Los módulos Preload solo pueden operar sobre módulos que autoricen al Preload a ser ejecutado. Esto se hace con la propiedad _preload: [mod1, mod2, modN]
Cada módulo puede autorizar N cantidad de preload, y serán ejecutados en el orden indicado.

#### Postload
Sigue exactamente las mismas reglas que el Preload, sólo que los Postload son ejecutados al final de un módulo.
Siguiendo el ejemplo anterior, podemos crear un Postload que comprima la salida JSON que es devuelta al consumidor.
Sigue la misma regla, necesita ser autorizado. Para ello debe ser agregada a la propiedad _postload:[mod1, mod2, modN]

#### Core
Estos módulos son internos de SISS y generan scopes globales (disponibles para todos).

### Objetos globales (MWS)
SISS ofrece un grupo de objetos globales con el fin de poder ayudar a facilitar el desarrollo de módulos.
Los mismos son creados en runtime (es decir son generadas una vez que el módulo es cargado).

#### ** \_\_SISS\_\_ **
El objeto __SISS__ ofrece los métodos necesarios para cargar librerías (propias del módulo o de terceros), notificar logs en los canales de Redis o devolver la salida (json,html, etc).

#### ** Me **
El object Me representa al módulo en sí mismo. Solo está disponible en el MWS(Middleware)

### Métodos globales
Los métodos globales son aquellos que si o si debemos crear en los archivos index.js del mws(Middleware). Si alguno de estos métodos faltara el módulo no sera cargado en el contexto de SISS.

#### \_\_init\_\_
Este método es el constructor que SISS ejecutará una vez cargado el módulo. El mismo va en el index.js del mws.

``` 
//__init__ and load methods example
{@lang javascript}
		__init__: function(){
			this.Sky  = this.__SISS__.load('skyscanner', this.Me);
			this.Sky = new Skyscanner();
		}
```

### Mensajes de error al cargar módulos

Siempre que veamos un mensaje de error con el signo “!” antes de una palabra o expresión significa que se esperaba encontrar esa propiedad y la misma no fue declarada.
Por ejemplo: 
!type   
Nos indica que no fue declarada la propiedad **_type**

### Eventos / IO.

SISS hace un fuerte uso de Redis en varios casos, algunos de ellos son:
* Mantener las sessions de los usuarios
* Soporte para Socket.IO
* Logs real time de los procesos internos de las apps.
* Comunicación entre procesos y apps.


Estructura de los real time de apps (runtime).
``` 
{@lang javascript}
	{  
	   AppName:'MyApp',
	   AppVersion:''1.0.1',
	   Type:'Debug',
	   Msg:'CC valid!',
	   cData:{  
	      ...
   		}
	}
```

Esta es la estructura que debe respetar cualquier app para informar sus logs por medio del canal “SISSLogsRT” de redis.

El canal ‘SISSEventsToFront’ es un canal diseñado para que las apps puedan notificar acciones o eventos a las etapas frontend por medio de socket.io.
La estructura de datos para eventos es:
``` 
{@lang javascript}
	{
		evtId: 100
		,evtName:’Event X’
		,evtCallback: ‘funcName’
		,evtCData: {}
	}
```

El objeto es enviado al canal redis, SISS se encargará de notificar a todos los navegadores que se encuentren conectados.

#### Eventos internos de SISS

*[rconsoleMsg](global.html#event:rconsoleMsg)*: se emite para notificar por redis a una terminal conectada algún mensaje.

### Startup SISS
** HTTPS **
Para habilitar el https dentro de SISS.
``` 
{@lang bash} 
sudo node app.js  -port 1234 -https -key ./cert/ssl.key -crt ./cert/ssl.crt
```

** Default **

```
{@lang bash} run: node app.js -port xxxx
```

#### Production
url: http://despegando.travel

#### Desarrollo
lync.com.ar
/home/repos/new/satelites

### SISS Documentation
Esta documentación está basada en JSDOC v3 y se utiliza docstrap como template. Cada package deberá documentarse con el mismo estandar que el SISS Core para unificar criterios. Además de la documentación del código, se recomienda crear una documentación de implementación por package, escribiendo un myPackage.md (Markdown file).

* [JSDOC](http://usejsdoc.org/)
* [DocStrap](https://github.com/terryweiss/docstrap) 

Para generar la documentación hay que ejecutar el comando jsdoc. Para la documentación del core se utiliza este command
```
{@lang bash} 
{$pathToSISS}/siss1.2/node_modules/.bin/jsdoc . -r -d {$pathToDoc} -t {$pathToSISS}/siss1.2/node_modules/ink-docstrap/template -c {$pathToSISS}/siss1.2/node_modules/jsdoc/conf.json SISSCore.md -u ./ 
```

Se invoca el jsdoc command con el param 
* . -r que indca que liste todos los archivos de esa carpeta y todas sus carpetas hijas. 
* -d indica el output de la doc. Por default es la carpeta out en el mismo dir donde se ejecuta el comando
* -t indica que template utilizará jsdoc. SISS utiliza docstrap
* -c para indicar la ruta del archivo de configuración (conf.json). En este archivo se indica el estilo de bootswatch(skins de bootstrap), que archivos tiene en cuenta para generar la documentación, visualización de la barra de navegación, si se ve o no el código fuente.
* -u ./ indica que hay una carpeta tutorials que debe coincidir con el tag @tutorial en los *.js. JSDOC buscará los nombres de archivos asociados a los @tutorial tags. 
* SISSCore.md luego del conf.json indica que será el index de la documentación.

Los tags más utilizados son:
* *@namespace* sirve para indicar namespaces o crear menús virtuales en jsdoc
* *@module* 
* *@class* 
* *@param* se utiliza siempre que hay un param en cualquier function
* *@method* si una function está dentro de un object, es un método.
* *@return* indica el tipo de retorno de las function
* *@memberOf* hay veces en donde jsdoc no detecta los métodos o functions que pertenecen a un namespace, ya sea por una , antes de la doc u otro detalle. Ahi es cuando se utiliza memberOf. 

El estandar para documentar un método es el siguiente
```
{@lang javascript} 
		/**
         * TODO Implementation
         * @memberOf SISSCore
         * @method install
         * @param  {[type]} args [descriptionn]
         * @return {[type]}      [description]
         */
         ,install:function(args){
			console.log('Installing...', args);
        }
```
  		
SISSCore está declarado como @namespace pero jsdoc no detecta automáticamente el método porque en la declaración del nombre de la function hay una *","* para cumplir un estandar de buenas prácticas. Por eso se le indica @memberOf SISSCore. El orden de los tags no debería implicar un problema en la doc final.




[Bootstrap](http://twitter.github.io/bootstrap/index.html) based template for [JSDoc3](http://usejsdoc.org/).
In addition, it includes all of the themes from [Bootswatch](http://bootswatch.com/) giving you a great deal of look
and feel options for your documentation, along with a simple search. Additionally, it adds some options to the conf.json file that gives
you even more flexibility to tweak the template to your needs. It will also make your teeth whiter.

## New ##
* Courtesy [whitelynx](https://github.com/whitelynx), you can now also select [sunlight themes](https://github.com/tmont/sunlight/tree/master/src/themes) 
for code blocks.
* Read about Google Analytics (tip of the hat to [pocesar](https://github.com/pocesar))
support and major syntax highlight changes. 
* As of version 0.4.0, DocStrap only supports the node version of JSDoc and will no longer support the Java version of JSDoc
* New options in `jsdoc.conf.json` to provide greater control over the output of source files. See `outputSourceFiles` and `sourceRootPath`
* Several updated components for the development environment


## Features ##

* Right side TOC for navigation in pages, with quick search
* Themed
* Customizable

### What It Looks Like ###
Here are examples of this template with the different Bootswatch themes:

+ [Amelia](http://terryweiss.github.io/docstrap/themes/amelia)
+ [Cerulean](http://terryweiss.github.io/docstrap/themes/cerulean)
+ [Cosmo](http://terryweiss.github.io/docstrap/themes/cosmo)
+ [Cyborg](http://terryweiss.github.io/docstrap/themes/cyborg)
+ [Flatly](http://terryweiss.github.io/docstrap/themes/flatly)
+ [Journal](http://terryweiss.github.io/docstrap/themes/journal)
+ [Readable](http://terryweiss.github.io/docstrap/themes/readable)
+ [Simplex](http://terryweiss.github.io/docstrap/themes/simplex)
+ [Slate](http://terryweiss.github.io/docstrap/themes/slate)
+ [Spacelab](http://terryweiss.github.io/docstrap/themes/spacelab)
+ [Spruce](http://terryweiss.github.io/docstrap/themes/spruce)
+ [Superhero](http://terryweiss.github.io/docstrap/themes/superhero)
+ [United](http://terryweiss.github.io/docstrap/themes/united)

To change your theme, just change it in the `conf.json` file. See below for details.
## Ooooh, I want it! How do I get it?##

If you manage your own version of jsdoc:

``` 
{@lang bash}
npm install ink-docstrap
```

When using [grunt](http://gruntjs.com/), please look at [grunt-jsdoc](https://github.com/krampstudio/grunt-jsdoc) which includes
docstrap

```  
{@lang bash}
npm install grunt-jsdoc 
```

## Configuring the template ##

DocStrap ships with a `conf.json` file in the template/ directory. It is just a regular old
[JSDoc configuration file](http://usejsdoc.org/about-configuring-jsdoc.html), but with the following new options:

``` 
{@lang javascript}
module.exports ={
        '_name':        'geo'
        ,'_version':    '1.0.0'
        ,'_type':          'api'
        ,'_virtualdir': 'geo'
       ,’_mysql’:{
		  connection:{ user : 'satelites',
                password : 'satelites',
            	    host : 'mysqlserver.aws',
                database : 'satelites'

}
        ,'_mongodb':    {
                                        connection: { 'connection':             'mongodb://mongo.aws/geo' }
                                        ,collections: ['airports', 'cache','logs','searchs','countries','cities']
                
                                        }
        ,'_transactions': false
       ,‘_domains’: [‘misite1.com’,’127.0.0.1’,’othersite.com’]
	,’_conf’:{
		myProperty: ‘oh yes!’
}
};

```
### Options ###

*   __systemName__
	The name of the system being documented. This will appear in the page title for each page
*   __footer__
	Any markup want to appear in the footer of each page. This is not processed at all, just printed exactly as you enter it
*   __copyright__
	You can add a copyright message below the footer and above the JSDoc timestamp at the bottom of the page
*   __navType__
	The template uses top level navigation with dropdowns for the contents of each category. On large systems these dropdowns
	can get large enough to expand beyond the page. To make the dropdowns render wider and stack the entries vertically, set this
	option to `"inline"`. Otherwise set it to `"vertical"` to make them regular stacked dropdowns.
*   __theme__
	This is the name of the them you want to use **in all lowercase**. The valid options are
	+ `amelia`
	+ `cerulean`
	+ `cosmo`
	+ `cyborg`
	+ `flatly`
	+ `journal`
	+ `readable`
	+ `simplex`
	+ `slate`
	+ `spacelab`
	+ `spruce`
	+ `superhero`
	+ `united`
*   __linenums__
	When true, line numbers will appear in the source code listing. If you have
	[also turned that on](http://usejsdoc.org/about-configuring-jsdoc.html).
*   __collapseSymbols__
	If your pages have a large number of symbols, it can be easy to get lost in all the text. If you turn this to `true`
	all of the symbols in the page will roll their contents up so that you just get a list of symbols that can be expanded
	and collapsed.
*   __analytics__ Add a [Google Analytics](http://www.google.com/analytics) code to the template output
 _e.g._ `"analytics":{"ua":"UA-XXXXX-XXX", "domain":"XXXX"}`
    * __ua__ The google agent (see Google Analytics help for details)
    * __domain__ The domain being served. (see Google Analytics help for details)
*   __inverseNav__
	Bootstrap navbars come in two flavors, regular and inverse where inverse is generally higher contrast. Set this to `true` to
	use the inverse header.
*   __outputSourceFiles__
	When true, the system will produce source pretty printed file listings with a link from the documentation.
*	__outputSourcePath__
	When `outputSourceFiles` is `false`, you may still want to name the file even without a link to the pretty printed output.
	Set  this to `true` when `outputSourceFiles` is `false`. `outputSourceFiles` when `true` takes precedence over this setting.
*   __dateFormat__ The date format to use when printing dates. It accepts any format string understood by [moment.js](http://momentjs.com/docs/#/displaying/format/)
*   __highlightTutorialCode__ Boolean used to determine whether to treat code blocks in "tutorial" markdown as examples and highlight them
*   __syntaxTheme__ String that determines the theme used for code blocks. Default value is `"default"`. It can be any value supported
    at [sunlight themes](https://github.com/tmont/sunlight/tree/master/src/themes) which right now consists of...uh...`"default"` and `"dark"`, 
    but at least you have it if you need it.

## Controlling Syntax Highlighting ##
Of course this is intended to document JS. But JS often interacts with other languages, most commonly `HTML`, but also any
language on the server including PHP, C# and other C-like languages. The point is that when you write examples, you may want to
include other languages to make your examples as expressive as possible. So, DocStrap introduces a new documentation tag
which can appear inside any example block in source code, or in any fenced code block in markdown: `{@lang languageName}`, where
_`language`_ can be any of the languages supported by [Sunlight](http://sunlightjs.com/)

Look at this: 
For an example of this thing in action [this](http://terryweiss.github.io/docstrap/themes/readable/#toc7) )__


The syntax for adding the tag is as follows. When in markdown, add the tag on the line just after the \`\`\` fence like so:

\`\`\`

`{@lang language}` 

`This is my code`

\`\`\`

When in a doclet add the tag just after the `@example` tag like this:

`@example {@lang xml}`

`<div>This is the most interesting web site ever</div>`


These are the supported languages. 
 
* ActionScript
* bash 
* C/C++
* C♯
* CSS
* Diff
* DOS batch
* Erlang
* Haskell
* httpd (Apache)
* Java
* JavaScript
* Lisp
* Lua
* MySQL
* nginx
* Objective-C
* Perl
* PHP
* PowerShell
* Python
* Ruby
* Scala
* T-SQL
* VB.NET
* XML (HTML)


## Customizing DocStrap ##
No template can meet every need and customizing templates is a favorite pastime of....well, no-one, but you may need to anyway.
First make sure you have [bower](https://github.com/bower/bower) and [grunt-cli](https://github.com/gruntjs/grunt-cli) installed.
Fetch the source using `git` or grab the [zip file from github.](https://github.com/terryweiss/docstrap/archive/master.zip) and unzip
it somewhere. Everything that follows happens in the unzip directory.

Next, prepare the environment:
     
    bower install     

and         
   
    npm install     

When that is done, you have all of the tools to start modifying the template. The template, like Bootstrap, uses [less](http://lesscss.org/).
The way it works is that `./styles/main.less` pulls in the bootstrap files uncompiled so that you have access to all of bootstraps mixins, colors,
etc, that you would want. There are two more files in that directory, `variables.less`, `bootswatch.less`. These are the
theme files and you can modify them, but keep in mind that if you apply a new theme (see below) those files will be overwritten. It is best
to keep your changes to the `main.less` file.

To compile your changes to `main.less` and any other files it loads up,

	grunt less 	

The output is will be put in `./template/static/styles/site.<theme-name>.css`. The next time you create your documentation, it
will have the new css file included.

To apply a different template to the `styles` directory to modify, open up the `conf.json` in the template directory and
change the `theme` option to the theme you want. Then

	grunt apply 

And the new theme will be in `variables.less`, `bootswatch.less`. Don't forget to compile your changes using `grunt apply` to
get that change into the template.

**NOTE** that these steps are not necessary to just change the theme, this is only to modify the theme. If all you want to do is
change the theme, just update conf.json with the new theme and build your docs!

## Contributing ##
Yes! Contribute! Test! Share your ideas! Report Bugs!

### Contributers ###

*Huge* thanks to all contributors. If your name should be here, but isn't, please let me know

* [marklagendijk](https://github.com/marklagendijk)
* [michaelward82](https://github.com/michaelward82)
* [kaustavdm](https://github.com/kaustavdm)
* [vmeurisse](https://github.com/vmeurisse)
* [bmathern](https://github.com/bmathern)
* [jrkim123us](https://github.com/jrkim123us)
* [shawke](https://github.com/shawke)
* [mar10](https://github.com/mar10)
* [mwcz](https://github.com/mwcz)
* [pocesar](https://github.com/pocesar)
* [hyperandroid](https://github.com/hyperandroid)
* [vmadman](https://github.com/vmadman)
* [whitelynx](https://github.com/whitelynx)


## History ##
### v0.4.11 ###
* Pull Request #59

### v0.4.8 ###
* Issue #58

### v0.4.7 ###
* Issue #57

### v0.4.5 ###
* Issue #55
* Issue #54
* Issue #52
* Issue #51
* Issue #50
* Issue #45
* Issue #44

### v0.4.3 ###
* Issue #46
* Issue #46
* Issue #47

### v0.4.1-1###
* Issue #44
* Update documentation
* Issue #43
* Issue #42
* Issue #34

### v0.4.0 ###
* Issue #41
* Issue #40
* Issue #39
* Issue #36
* Issue #32

### v0.3.0 ###
* Fixed navigation at page top
* Adds -d switch to example jsdoc command.
* Fixed typo in readme
* Improve search box positioning and styles
* Add dynamic quick search in TOC
* Fix for line numbers styling issue

### v0.2.0 ###

* Added jump to source linenumers - still a problem scrolling with fixed header
* changed syntax highlighter to [sunlight](http://sunlightjs.com/)
* Modify incoming bootswatch files to make font calls without protocol.

### v0.1.0 ###
Initial release


## Notices ##
If you like DocStrap, be sure and check out these excellent projects and support them!

[JSDoc3 is licensed under the Apache License](https://github.com/jsdoc3/jsdoc/blob/master/LICENSE.md)

[So is Bootstrap](https://github.com/twitter/bootstrap/blob/master/LICENSE)

[And Bootswatch](https://github.com/thomaspark/bootswatch/blob/gh-pages/LICENSE)

[TOC is licensed under MIT](https://github.com/jgallen23/toc/blob/master/LICENSE)

[Grunt is also MIT](https://github.com/gruntjs/grunt-cli/blob/master/LICENSE-MIT)

DocStrap [is licensed under the MIT license.](https://github.com/terryweiss/docstrap/blob/master/LICENSE.md)

[Sunlight uses the WTFPL](http://sunlightjs.com/)

## License ##
DocStrap Copyright (c) 2012-2014 Terry Weiss. All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.






