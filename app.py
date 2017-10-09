import re
import base64
import requests

#from PIL import Image
#from io import BytesIO
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

   	   
@app.route('/wh', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        url = 'http://localhost:443/process'
        headers = {'Content-type': 'application/json', 'Accept': 'application/json'}
        dataJSON = request.get_json(silent=True, force=True)
        response = requests.post(url, headers=headers, data=dataJSON)
        #guardarImagen(str_img)
        #data = re.sub('^data:image/.+;base64,', '', str_img).decode('base64')
        #im = Image.open(BytesIO(base64.b64decode(data)))

        return response.json()
					
		
@app.route("/main")
def principal():
	return render_template("index.html")

@app.route("/photo_capture")
def cargafoto():
	return render_template("photo_capture.html")
	
@app.route("/loading")
def espera():
	return render_template("photo_loading.html")
	
@app.route("/photo_results")
def resultados():
	return render_template("result.html")

def guardarImagen(str_img):
    texto_base = str_img[22:]
    procesado = base64.b64encode(bytes(texto_base, 'utf-8'))
    print(texto_base)
    with open("imageToSave.png", "wb") as fh:
        fh.write(base64.decodebytes(str_img))	

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=5050)