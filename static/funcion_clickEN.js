var texto_final = "";
var query = "";

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


document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
var keyCode = e.keyCode;
  if(keyCode==75) {
	  accion();
  }
}

window.addEventListener("load", function() {
			  var camera = document.getElementById("camera");
			  var play = document.getElementById("play");
			  var pause = document.getElementById("pause");
			  var stop = document.getElementById("stop");
			  var constraints = {audio:false, video:true};

			  function success(stream) {
				camera.src = window.URL.createObjectURL(stream);
				camera.play();
				disableButtons(true, false, false);
			  }

			  function failure(error) {
				console.log(JSON.stringify(error));
			  }

			  function disableButtons(disPlay, disPause, disStop) {
				console.log("roto");
				play.disabled = disPlay;
				pause.disabled = disPause;
				stop.disabled = disStop;
			  }

			  disableButtons(true, true, true);

			  if (navigator.getUserMedia) {
				navigator.getUserMedia(constraints, success, failure);
			   }else
				alert("Your browser does not support getUserMedia()");

			  play.addEventListener("click", function() {
				disableButtons(true, false, false);
				camera.play();
			  }, false);

			  pause.addEventListener("click", function() {
				disableButtons(false, true, false);
				camera.pause();
			  }, false);

			  stop.addEventListener("click", function() {
				disableButtons(true, true, true);
				camera.pause();
				camera.src = "";
			  }, false);
}, false);