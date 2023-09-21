# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS module
from flask_sock import Sock
from SayHiChain import SayHiChain

import subprocess
import text2img
import speech2text
import subprocess
import os
from subprocess import Popen, PIPE

app = Flask(__name__)
CORS(app)  # Apply CORS to your app
sock = Sock(app)

# Initialize SayHiChain
say_hi_chain = SayHiChain()

@sock.route('/ws')
def echo(sock):
    userId = request.args.get('userId')
    lines_to_send = []  # Lista para almacenar las líneas
    recordLine = False
    data = sock.receive()
    popen = subprocess.Popen(['python', '-u', 'langchain_main.py',
                             data, userId], stdout=subprocess.PIPE, universal_newlines=True, encoding="utf-8")
    for line in popen.stdout:
        print(f'recordLine {recordLine } {line}')
        if line.find('[32;1m') != -1 and line.find('Action') == -1 and line.find('Observation') == -1:
            recordLine = True
        if line.startswith("Thought:"):
            recordLine = True
        elif line.find('Final Answer') >= 0:
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
        sock.close()

    if return_code:
        print("Command error. Closing socket...")
        sock.close()
        raise subprocess.CalledProcessError(
            return_code, ['python', 'langchain_main.py', data])



@app.route('/text2img', methods=['GET'])
def create_image():
    prompt = request.args.get('prompt')
    imgUrl = text2img.transform(prompt)
    return imgUrl

@app.route('/speech2text', methods=['POST'])
def upload_audio():
    print('audio_data recibido')
    if 'audio_data' not in request.files:
        return 'No se proporcionó ningún archivo de audio', 400

    audio_file = request.files['audio_data']

    if audio_file.filename == '':
        return 'Nombre de archivo vacío', 400

    file_path = os.path.join(os.getcwd(), 'audio_files', audio_file.filename)
    audio_file.save(file_path, buffer_size=16384)
    audio_file.close()
    print(os.path.abspath(audio_file.filename))

    if audio_file:
        speech = speech2text.transcribe(file_path)
        return speech

@app.route('/greeting-chain', methods=['POST'])
def greeting_chain():
    print('greeting-chain')
    try:
        unreadEmails = request.json['unreadEmails']
        eventsTodayMainCalendar = request.json['eventsTodayMainCalendar']
        drafts = request.json['drafts']
        greetingChainResult = say_hi_chain(inputs={"unreadEmails": unreadEmails, "eventsTodayMainCalendar": eventsTodayMainCalendar, "drafts": drafts})
        return jsonify({"success": greetingChainResult['text']})
    except Exception as e:
        return jsonify({"error2": str(e)})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
