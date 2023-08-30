from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS module

import asyncio
import websockets
import subprocess
import langchain_main

app = Flask(__name__)
CORS(app)  # Apply CORS to your app

async def send_via_websocket(message):
    uri = "ws://localhost:8765"  # Change this to your WebSocket server's URI
    async with websockets.connect(uri) as websocket:
        await websocket.send(message)

@app.route('/api/chat', methods=['POST'])
def process_data():
    try:
        response = langchain_main.message(request.json['question'])
        return jsonify({"success": response})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)