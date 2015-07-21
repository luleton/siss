# SISS 1.4

## Introducción


SISS 1.4 es un servidor de aplicaciones orientado a brindar soluciones integrales a la hora de desarrollar soluciones basadas en Node.js.
Está basado en Express 4.x, aunque en su interior asume el control de las URL virtuales, los contenidos estáticos, comodines y virtual hosts.
 
**Entre los feature mas importantes de SISS 1.4 encontramos:**
- Mecanismo de packages.
- Soporte de virtual hosts.
- URL dinámicas, con comodines.
- Sistema propio para resolver contenidos estáticos.
- Virtual Hosts dinámicos.
- Grupo de librerías para resolver tareas cotidianas.

## Instalación
> El proceso de instalación está basado en Debian.

<pre>
sudo apt-get update
sudo apt-get install build-essential mongod
</pre>

## SISS se divide en SISSCore y Packages 


El objeto SISSCore esta disponible en todo el ambiente SISS. 
Es una variable global con la instancia principal de SISS que aporta una serie de herramientas (métodos, utiles, manejo de logs, series, virtual hosts ) para ser utilizadas en los packages.


## RUN


### Arguments:
- -port N : set the listen port
- -cluster true|false: use cluster CPU (require optimize packages).
- -profiler true|false: use profiler, configure newrelic key
- -debug N: set debug leve, default is 0
- -pport N: set the internal private cluster initial port instance

## Package Home
El package Home es un ejemplo simple de como se desarrollar packages dentro de la plataforma SISS.

# Creando un package.
## Estructura de directorios.
- ./mws  : directorio con los mws. Siempre levanta el archivo index.js
- ./views/ : directorio con las vistas. Por defecto lee el archivo layout.hbs
- ./routes/ : lee el archivo index.js para levantar las rutas por defecto del package.
- ./public/ : el contenido estático del package.
- ./locales/ : los archivos de internacionalización del package.

# SISSCore.
## Methods
### registerMWS(cb)
El método registerMWS registra un mws a nivel global, el cual se ejecutará en todos los request de TODOS los packages.

<pre>
  SISSCore.registerMWS(function(req, res, next){
            console.log("Soy el MWS1 > ");
            next();
        } );
</pre>


# internacionalización

Para poder implementar la internacionalización es necesario implementar dentro del MWS "SISSCore.getLocales"
<pre>
.implement(SISSCore.getLocates());
</pre>

## Languages
Los archivos de idioma van alojados dentro del directorio "locales/languages" de cada package.
Los idiomas son archivos $code.po (archivo de texto), donde $code es el código del idioma selecionado: ej es.json, en.json, br.json.
Para poder usar el mecanismo de traduccion simplemente debemos agregar los meta tags _("aca va el texto a traducir");


<pre>
msgid El texto original
msgStr el texto por que cual va a ser reemplazado
</pre>

El idioma default se setea en la cookie indicada dentro de la property "$languageCookie" del MWS (constructor).

# Request process

R-> SISS ( EXPRESS)-> MWS 


# Creditos.
Powered by Satélites Team.
Arquitecto: César Casas.
Developers: Oscar Lopez.

## Markdown
https://stackedit.io/editor
