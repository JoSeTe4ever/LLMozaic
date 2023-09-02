from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS module
from flask_sock import Sock
from contextlib import redirect_stdout

import subprocess
import langchain_main
import subprocess
from subprocess import Popen, PIPE

app = Flask(__name__)
CORS(app)  # Apply CORS to your app
sock = Sock(app)


@sock.route('/ws')
def echo(sock):
        data = sock.receive()
        popen = subprocess.Popen(['python', '-u', 'langchain_main.py', data], stdout=subprocess.PIPE, universal_newlines=True)
        for line in popen.stdout:
            print('line'+ line);
            sock.send(line)

        return_code = popen.wait()
        
        if return_code == 0:
            print("Command finished successfully.")
            sock.close("Command finished successfully.")

        if return_code:
            sock.close("Command finished unexpected.")
            raise subprocess.CalledProcessError(return_code, ['python', 'langchain_main.py', data])
            

@app.route('/api/chat', methods=['POST'])
def process_data():
    try:
        response = langchain_main.message(request.json['question'])
        return jsonify({"success": response})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)