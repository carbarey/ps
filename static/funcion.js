// Variables globales
var texto_final = "";
var query = "";
var longitud = 0;

// Contructor y declaración del SDK Bot Libre
SDK.applicationId = "8973096060929297867";
var sdk = new SDKConnection();
var web = new WebAvatar();
web.connection = sdk;
web.avatar = "348727";
web.nativeVoice = true;
web.nativeVoiceName = "Google UK English Female";

web.width = "500";
web.height = "600";
web.createBox();
web.background = "black";
web.addMessage("");
web.processMessages();


// Funcion encargada de hablar y dividir las frases recibidas
var speechUtteranceChunker = function (utt, settings, callback) {
    settings = settings || {};
    var newUtt;
    var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
    if (utt.voice && utt.voice.voiceURI === 'native') { // Not part of the spec
        newUtt = utt;
        newUtt.text = txt;
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
            }
            if (callback !== undefined) {
                callback();
            }
        });
    }
    else {
        var chunkLength = 180;
		
		// Expresion Regular para obtener la cadena de caracteres que se va a reproducir
        var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 3) + ',' + chunkLength + '}[.!?]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
        var chunkArr = txt.match(pattRegex);
	
        if (chunkArr[0] === undefined || chunkArr[0].length < 2) {
            //call once all text has been spoken...
            if (callback !== undefined) {
                callback();
            }
            return;
        }
        var chunk = chunkArr[0];
		// Creamos la instancia para reproducir el mensaje
        newUtt = new SpeechSynthesisUtterance(chunk);
		newUtt.lang = "es-ES";
		newUtt.rate = 1.15;
        newUtt.addEventListener('end', function () {
			newUtt.text = aux2;
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
                return;
            }
            settings.offset = settings.offset || 0;
            settings.offset += chunk.length - 1;
			// Llamada anidada
            speechUtteranceChunker(utt, settings, callback);
        });
    }
    var aux = "";
	var aux2 = newUtt.text;
	for (var j = 0; j<newUtt.text.length;j++){
		if (newUtt.text[j] != "."){
				aux = aux + newUtt.text[j];
		}
	}
	newUtt.text = aux;
    console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
    //placing the speak invocation inside a callback fixes ordering and onend issues.
    setTimeout(function () {
		if (newUtt.text === ""){callback();return;}
        speechSynthesis.speak(newUtt);
    }, 0);
};


// Creacion del objeto de Reconocimiento de Voz
var x = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
x.interimResults = true;
x.continuous = true;
x.lang="es-ES";


// Evento cuando detecte algo.
x.onresult=function(e){
	console.log(e);
	if (event.results.length > 0) {
		son = event.results[event.results.length-1];
		// Si la confianza del resultado es mayor de 0.5 (valor aceptable)
		if (son[0].confidence > 0.5){
			console.log(longitud);
			console.log(son[0].transcript.length);
			query = son[0].transcript.substring(longitud, son[0].transcript.length);
			console.log(query);
			if (query != ""){
				// Peticion para Api.Ai
				var texto = JSON.stringify({'query': query, 'sessionId': "1990", 'lang': 'es'});
				$.ajax({
					type: 'POST',
					url: 'https://api.api.ai/v1/query?v=20150910',
					beforeSend: function(xhr) {
					xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					xhr.setRequestHeader("Authorization", "Bearer 53041188f45848c6b9a675798b6fa4ad");
					},
					data: texto,
					success: function(x) {
						longitud = longitud + query.length + 1;
						texto_final = x.result.fulfillment.speech;
						web.addMessage(texto_final);
						web.processMessages();
					}
				});
			}	
		}
		// Si es final reseteamos la longitud del texto a no leer.
		if (son.isFinal){
			longitud = 0;
		}
	}
}


// Si finaliza el reconocimiento, volvemos a iniciarlo. Llamamos a una funcion para dar tiempo a que pueda finalizar el objeto.
x.onend = function (e){
	acabado();
}

function acabado(){
	x.start();
}


// Inicializacion del reconocimiento
x.start();

