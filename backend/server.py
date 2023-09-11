#server.py
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS module
from flask_sock import Sock
from contextlib import redirect_stdout
from SayHiChain import SayHiChain

import subprocess
import langchain_main
import subprocess
from subprocess import Popen, PIPE

app = Flask(__name__)
CORS(app)  # Apply CORS to your app
sock = Sock(app)

# Initialize SayHiChain
say_hi_chain = SayHiChain()

welcome_message_sent = {}


@sock.route('/ws')
def echo(sock):
        userId = request.args.get('userId')
        lines_to_send = []  # Lista para almacenar las líneas
        recordLine = False;
         # Comprueba si el mensaje de bienvenida ya se ha enviado a este usuario
        if userId not in welcome_message_sent or not welcome_message_sent[userId]:
            # Envia el mensaje de bienvenida
            unread_emails = 5  # Sustituir por el número real de correos electrónicos no leídos
            greeting = say_hi_chain.run({"unread_emails": unread_emails})
            sock.send(greeting)
        
            # Marca el mensaje de bienvenida como enviado para este usuario
            welcome_message_sent[userId] = True

        data = sock.receive()
        popen = subprocess.Popen(['python', '-u', 'langchain_main.py', data, userId], stdout=subprocess.PIPE, universal_newlines=True)
        for line in popen.stdout:
            print(line, end='')
            if line.find('[32;1m') != -1 and line.find('Action') == -1 and line.find('Observation') == -1:
                recordLine = True
            if line.startswith("Thought:"):
                recordLine = True
            elif line.startswith("Action"):
                recordLine = False
            elif line.startswith("Observation"):
                recordLine = False
            elif line.startswith("\n"):
                if len(lines_to_send) > 0:
                    sock.send(''.join(lines_to_send))
                    lines_to_send = []
            if recordLine:
                lines_to_send.append(line)
            # Procesa las líneas almacenadas y luego límpialas

        return_code = popen.wait()
        
        if return_code == 0:
            print("Command finished successfully. Closing socket...")
            #sock.close()

        if return_code:
            print("Command error. Closing socket...")
            sock.close()
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