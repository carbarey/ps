var imagen = "";

window.addEventListener("load", function() {
	var video = document.getElementById("video");
	var canvas = document.getElementById("canvas");
	var play = document.getElementById("play");
	var pause = document.getElementById("pause");
	var stop = document.getElementById("stop");
	var constraints = {audio:false, video:true};

	function success(stream) {
		video.src = window.URL.createObjectURL(stream);
		video.play();
		disableButtons(true, false, false);
	}

	function failure(error) {
		console.log(JSON.stringify(error));
	}

	function disableButtons(disPlay, disPause, disStop) {
		play.disabled = disPlay;
		pause.disabled = disPause;
		stop.disabled = disStop;
	}

	disableButtons(true, true, true);

	if (navigator.getUserMedia)
		navigator.getUserMedia(constraints, success, failure);
	else
		alert("Your browser does not support getUserMedia()");

	play.addEventListener("click", function() {
		disableButtons(true, false, false);
		//if (video.src==="") video.src = strea; //strea not defined
		video.play();
	}, false);

	pause.addEventListener("click", function() {
		disableButtons(false, true, false);
		video.pause();
		takepicture();
	}, false);

	cambio.addEventListener("click", function() {
	 	photo.src = imagen;
	}, false);


	stop.addEventListener("click", function() {

		$.ajax({
			url: 'http://34.249.147.24:8080/process',
			type: "POST",
			crossDomain: true,
			contentType: 'application/json',
			dataType: "json",
			//data: JSON.stringify({'img': photo.src}),
			data: JSON.stringify({'img': "hola"}),
			success: function (data){
				console.log("success ajax");
				console.log(data)
				//imagen = server_answer.respuesta;
			},
			error: function(xhr, ajaxOptions, thrownError) {
				console.log("error ajax")
		        console.log(thrownError)
		    }
		});

	}, false);


	function takepicture() {
	canvas.width = 350;
	canvas.height = 350*3/4;
	canvas.getContext('2d').drawImage(video, 0, 0, 350, 350*3/4);
	var data = canvas.toDataURL('image/png');
	photo.setAttribute('src', data);
	}
}, false);