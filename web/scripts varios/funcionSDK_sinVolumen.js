
function escuchar2(){
	
	var j = 0;
	var aux = "";
	var list = [];
	var count = 0;
	var txt = "Hola, somos Liquid Studio y nos gusta la tecnologia. La casa de Juan Pedro Luna es blanca como la luna.  Hola, somos Liquid Studio y nos gusta la tecnologia. Pepito no quiere hacer caso a la vida que le da de ostias hoy. Hola, somos Liquid Studio y nos gusta la tecnologia.";
	
	while (j<txt.length){
		if(count < 100){
			count = count + 1;
			aux = aux + txt.charAt(j);
			j = j + 1;
		}
		else{
			count = count + 1;
			aux = aux + txt.charAt(j);
			j = j + 1;
			
			if (txt.charAt(j) === " "){
				list.push(aux);
				count = 0;
				aux = "";
			}
		}
	}
	
	list.push(aux);
	console.log(list);
	
	for (var i=0; i<list.length; i++){
		if (i === list.length-1){
			var ult = new SpeechSynthesisUtterance();
			var voices = window.speechSynthesis.getVoices();
			ult.voice = voices[5]; // Note: some voices don't support altering params
			ult.voiceURI = 'native';
			ult.volume = 1; // 0 to 1
			ult.rate = 1; // 0.1 to 10
			ult.pitch = 0; //0 to 2
			ult.text = list[i];
			ult.lang = 'es';
			

			speechSynthesis.speak(ult);
		}
		else{
			var msg = new SpeechSynthesisUtterance();
			var voices = window.speechSynthesis.getVoices();
			msg.voice = voices[5]; // Note: some voices don't support altering params
			msg.voiceURI = 'native';
			msg.volume = 1; // 0 to 1
			msg.rate = 1; // 0.1 to 10
			msg.pitch = 0; //0 to 2
			msg.text = list[i];
			msg.lang = 'es';
			
			msg.addEventListener('end', function () {
				if (speechUtteranceChunker.cancel) {
					speechUtteranceChunker.cancel = false;
				}
				if (callback !== undefined) {
					callback();
				}
			});

			msg.onend = function(e) {
			  console.log('Finished in ' + event.elapsedTime + ' seconds.');
			};

			speechSynthesis.speak(msg);
			}
	}
}
	
function escuchar3() {
	var x = new webkitSpeechRecognition();
	x.lang="en-IN";
	x.onresult=function(e){
		if (event.results.length > 0) {
			son = event.results[event.results.length-1];
			if (son.isFinal){
				console.log(son[0].transcript);
				var texto = JSON.stringify({'query': son[0].transcript, 'sessionId': "1", 'lang': 'en'});
				$.ajax({
					type: 'POST',
					url: 'https://api.api.ai/v1/query?v=20150910',
					beforeSend: function(xhr) {
					xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					xhr.setRequestHeader("Authorization", "Bearer fd62b1dd6d8144f6896e4117c995a960");
					},
					data: texto,
					success: function(x) {
						console.log(x.result.fulfillment.speech);
						texto_final = x.result.fulfillment.speech;
						
						var aux = "";
						var contador = 0
						
						for (var i=0; i<texto_final.length;i++){
							if (texto_final.charAt(i) === "." || dos_puntos > 2){
								web.addMessage(aux);
								dos_puntos = 0;
								aux = "";
							}
							else{
								if (texto_final.charAt(i) === ":"){
									dos_puntos = 1;
								}
								else{
									if (texto_final.charAt(i) === "," && dos_puntos > 0){
										dos_puntos = dos_puntos + 1;
									}
								}
								aux = aux + texto_final.charAt(i);
							}
						}
						if (aux != ""){
							web.addMessage(aux)
						}
							web.processMessages();
					}
				});
			}
		}
	}
	x.start();
}
