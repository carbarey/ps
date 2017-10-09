var texto_final = "";


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
web.addMessage("Hola, somos Liquid Studio y nos gusta la tecnologia 1. La casa de Juan Pedro Luna es blanca como la luna. Pepito no quiere hacer caso a la vida que le da de ostias hoy. Hola, somos Liquid Studio y nos gusta el trabajo.");
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
        var chunkLength = (settings && settings.chunkLength) || 160;
        var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
        var chunkArr = txt.match(pattRegex);
	
        if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
            //call once all text has been spoken...
            if (callback !== undefined) {
                callback();
            }
            return;
        }
        var chunk = chunkArr[0];
        newUtt = new SpeechSynthesisUtterance(chunk);
        var x;
        newUtt.voice = utt.voice;
		newUtt.voiceURI = utt.voiceURI;
		newUtt.lang = "es-ES";
        newUtt.addEventListener('end', function () {
            if (speechUtteranceChunker.cancel) {
                speechUtteranceChunker.cancel = false;
                return;
            }
            settings.offset = settings.offset || 0;
            settings.offset += chunk.length - 1;
            speechUtteranceChunker(utt, settings, callback);
        });
    }

    if (settings.modifier) {
        settings.modifier(newUtt);
    }
    console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
    //placing the speak invocation inside a callback fixes ordering and onend issues.
    setTimeout(function () {
        speechSynthesis.speak(newUtt);
    }, 0);
};

function escuchar(){
	var myLongText = "Hola, somos Liquid Studio y nos gusta la tecnologia 1. La casa de Juan Pedro Luna es blanca como la luna. Pepito no quiere hacer caso a la vida que le da de ostias hoy. Hola, somos Liquid Studio y nos gusta el trabajo.";

	var utterance = new SpeechSynthesisUtterance(myLongText);
	var voiceArr = speechSynthesis.getVoices();
	//modify it as you normally would
	utterance.voice = voiceArr[5];
	utterance.voiceURI = 'Google español';
	utterance.lang = "es-ES";
	

	//pass it into the chunking function to have it played out.
	//you can set the max number of characters by changing the chunkLength property below.
	//a callback function can also be added that will fire once the entire text has been spoken.
	speechUtteranceChunker(utterance, {
		chunkLength: 120
	}, function () {
		//some code to execute when done
		console.log('done');
	});
}
