import json
from http.server import *

def processImage(str_img):
    pass

class GetHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        try:
            if self.path.endswith("/process"):
                print("inside process")
                content_len = int(self.headers['Content-Length'])
                post_body = self.rfile.read(content_len)
                data = str(post_body.decode('utf-8'))
                json_data = json.loads(data)
                str_img = json_data["img"]
                result = processImage(str_img)



                self.send_response(200)
                self.send_header("Content-type", "application/json")
                #self.send_header("Access-Control-Allow-Origin", "*")
                #self.send_header("Access-Control-Expose-Headers", "Access-Control-Allow-Origin")
                self.end_headers()

                json_response = json.dumps({"id": {'classification': classification}})
                self.wfile.write(bytes(json_response, "utf-8"))

        except Exception as e:
            print("[ERROR]" + str(e))

        return

if __name__ == "__main__":
    HandlerClass = GetHandler
    ServerClass = HTTPServer

    protocol = "HTTP/1.0"
    host = "0.0.0.0"
    port = 443

    server_address = (host, port)

    HandlerClass.protocol_version = protocol
    httpd = ServerClass(server_address, HandlerClass)
    print ('Starting server at http://0.0.0.0:443')

    httpd.serve_forever()