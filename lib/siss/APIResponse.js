
/**
 * build object to use as response in APIs
 * 
 * @module ApiResponse
 * 
 * @param  {mixed} status 		HTTP status or object with params of functions
 * @param  {Object} data  		data to client
 * @param  {Object} error  		error to client with keys code and message
 * @param  {Array} warnings 	Array of strings with warnings
 * @return {Object}          	object result for response
*/
module.exports = function(status,data,error,warnings){

		/*
		HTTP Status:
			200 - OK, operación realizada con éxito
			201 - Created, creación exitosa de un nuevo recurso
			202 - Accepted, comienzo de una acción asincrónica

			304 - Not Modified, sólo para casos de cacheo

			400 - Bad Request, petición inválida
			401 - Unauthorized, las credenciales de acceso no son válidas
			403 - Forbidden, el recurso solicitado no esta dentro de los permitidos
			404 - Not Found, la URI solicitada no corresponde a ningun recurso
			405 - Method Not Allowed, el método HTTP no está soportado
			406 - Not Acceptable, el media type solicitado para la respuesta en el header Accept no es válido 
			409 - Conflict, el recurso que se intenta crear/modificar entra en conflicto con uno existente
			415 - Unsupported Media Type, el media type indicado en Content-Type del Request no es soportado (este es el formato del contenido del request)
            429 - rate limit

			500 - Internal Server Error, error del servidor, cualquier excepción del lado del server que no permita completar la operación
			501 - Not Implemented
			503 - Service Unavailable

		*/
	
		var newStatus=0;
		if(typeof status=="object"){
			if(typeof status.status!="undefined"){
				var newStatus=status.status;
			}
			if(typeof status.data!="undefined"){
				var data=status.data;
			}
			if(typeof status.error!="undefined"){
				var error=status.error;
			}
			if(typeof status.warnings!="undefined"){
				var warnings=status.warnings;
			}

			if(newStatus) status=newStatus;
		}

		switch(status){
			case 200:
			case 201:
			case 202:
			case 400:
			case 401:
			case 403:
			case 404:
			case 405:
			case 406:
			case 409:
			case 415:
            case 429:
			case 500:
			case 501:
			case 503:
			break;
			default:
			status=200;
			break;
		}

		this.status=status;

		var data=data||{};
		this.data=data;

		if(error){
			if(typeof error=="string"){
				error={code:status, message:error}
			}
			if(typeof error.code=="undefined"){
				error.code=status;
			}
			if(typeof error.message=="undefined"){
				error.message="Unexpected error";
			}

			this.error=error;
		}

		if(warnings){
			if(typeof warnings=="string"){
				warnings=[warnings];
			}else if(typeof warnings=="object"){
				var newWarning=[];
				for(var key in warnings){
					if(key in warnings)
					newWarning.push(warnings[key]);
				}
				warnings=newWarning;

			}


			this.warnings=warnings;
		}


}

/*
 Ejemplos:

// por default se crea un status 200 y un data vacio
var leResponse1 = new SissCore.apiResponse();

// una respuesta OK standard
var leResponse2 = new SissCore.apiResponse(200,{cosa:"loca"});

//el error en string se tranforma a object con keys code y message
var leResponse3 = new SissCore.apiResponse(400,null,{ code:6589,
													  message:"Metodo no existe"
													}
										   ); 

// el error en string se tranforma a object con keys code y message										   
var leResponse4 = new SissCore.apiResponse(500,null,"Se fue todo al carajo"); 

// warnings como string se pasan a array
var leResponse5 = new SissCore.apiResponse(200,{unamas:"Esta la data pero hay warnings"},null,"Faltan cosas"); 

// warnings como object se pasan a array
var leResponse6 = new SissCore.apiResponse(200,{unamas:"esta info pero rara"},null,{"uno":"unod","dos":"dosd"}); 

// si no se pasan parametros, se setean despues
var leResponse7 = new SissCore.apiResponse();
leResponse7.status=200;
leResponse7.data={"mas":"data para todos"};


console.log("leResponse1",leResponse1);
console.log("leResponse2",leResponse2);
console.log("leResponse3",leResponse3);
console.log("leResponse4",leResponse4);
console.log("leResponse5",leResponse5);
console.log("leResponse6",leResponse6);
console.log("leResponse7",leResponse7);

Imprime:

leResponse1 { status: 200, data: {} }
leResponse2 { status: 200, data: { cosa: 'loca' } }

leResponse3 { status: 400,
  data: {},
  error: { code: 6589, message: 'Metodo no existe' } }

leResponse4 { status: 500,
  data: {},
  error: { code: 500, message: 'Se fue todo al carajo' } }

leResponse5 { status: 200,
  data: { unamas: 'Esta la data pero hay warnings' },
  warnings: [ 'Faltan cosas' ] }

leResponse6 { status: 200,
  data: { unamas: 'esta info pero rara' },
  warnings: [ 'unod', 'dosd' ] }

leResponse7 { status: 200, data: { mas: 'data para todos' } }


 */