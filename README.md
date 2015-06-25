# siss
Servidor de aplicaciones desarrollado en Node.js

## Introducción


SISS 1.4 es un servidor de aplicaciones orientado a brindar soluciones integrales a la hora de desarrollar soluciones basadas en Node.js.
Está basado en Express 4.x, aunque en su interior asume el control de las URL virtuales, los contenidos estáticos, comodines y virtual hosts.
 
Entre los feature mas importantes de SISS 1.4 encontramos:
* Mecanismo de packages.
* Soporte de virtual hosts.
* URL dinámicas, con comodines.
* Sistema propio para resolver contenidos estáticos.
* Virtual Hosts dinámicos.
* Grupo de librerías para resolver tareas cotidianas.

### **SISS se divide en SISSCore y Packages** ###


**El objeto SISSCore esta disponible en todo el ambiente SISS.** Es una variable global con la instancia principal de SISS que aporta una serie de herramientas (métodos, utiles, manejo de logs, series, virtual hosts ) para ser utilizadas en los packages.


RUN
---

**Arguments:
- -port N : set the listen port
- -cluster true|false: use cluster CPU (require optimize packages).
- -profiler true|false: use profiler, configure newrelic key
- -debug N: set debug leve, default is 0
- -pport N: set the internal private cluster initial port instance




# internacionalizacion

Para poder implementar la internacionalizacion es necesario implementar dentro del MWS "SISSCore.getLocales"
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
