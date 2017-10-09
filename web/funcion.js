var texto_final = "";
var query = "";

SDK.applicationId = "8407226809810582195";
var sdk = new SDKConnection();
var web = new WebAvatar();
web.connection = sdk;
web.avatar = "12717875";
web.nativeVoice = true;
web.nativeVoiceName = "Google UK English Female";

web.width = "500";
web.height = "600";
web.createBox();
web.background = "black";
SDK.applicationId = "8407226809810582195";
web.addMessage("Hola.");
web.processMessages();


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
		
        newUtt = new SpeechSynthesisUtterance(chunk);
		newUtt.lang = "es-ES";
        newUtt.addEventListener('end', function () {
			newUtt.text = aux2;
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
                return;
            }
            settings.offset = settings.offset || 0;
            settings.offset += chunk.length - 1;
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

var x = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
x.continuous = true;
x.lang="es-ES";

x.onresult=function(e){
	if (event.results.length > 0) {
		son = event.results[event.results.length-1];
		query = son[0].transcript;
		console.log(query);
		var texto = JSON.stringify({'query': query, 'sessionId': "1990", 'lang': 'es'});
		$.ajax({
			type: 'POST',
			url: 'https://api.api.ai/v1/query?v=20150910',
			beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
			xhr.setRequestHeader("Authorization", "Bearer b9247e6f7f744a11bb5d3679afbd0042");
			},
			data: texto,
			success: function(x) {
				texto_final = x.result.fulfillment.speech;
				web.addMessage(texto_final);
				web.processMessages();
			}
		});	
	}
}

x.start();