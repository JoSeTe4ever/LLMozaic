# Mosaic: Your AI-Powered Virtual Assistant

![Mosaic Logo](frontend/public/Mosaic.jpeg)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Welcome to Mosaic, your personal AI-powered virtual assistant! Mosaic is a cutting-edge program that leverages artificial intelligence to help you efficiently manage your email, calendar, and contacts. Powered by Nylas API, Langchain, and LLM (Language Model), Mosaic is designed to streamline your daily tasks and boost your productivity.

Whether you're a busy professional, an entrepreneur, or anyone looking to simplify email and calendar management, Mosaic is here to make your life easier. Say goodbye to email overload and the hassle of managing appointments and contacts manually.

## Features

Mosaic offers a wide range of features to simplify your life:

- **Email Management:** Mosaic uses Nylas API to intelligently categorize, filter, and prioritize your emails. Say goodbye to sifting through cluttered inboxes.

- **Calendar Assistant:** Never miss an important appointment again. Mosaic helps you schedule meetings, set reminders, and manage your calendar effortlessly.

- **Contact Organization:** Keep your contacts in order with Mosaic. It uses AI to categorize and tag contacts, making it easy to find the people you need.

- **Natural Language Processing:** Mosaic's LLM (Language Model) ensures seamless communication with your virtual assistant. Simply ask for what you need in plain language.

- **Customizable Workflow:** Tailor Mosaic to your specific needs. Customize settings and preferences to make the assistant work just the way you want it to.

## Getting Started

### Prerequisites

Before you can start using Mosaic, make sure you have the following prerequisites in place (for a local installation):

- Python 3.7 or higher installed on your system.
- Node 18 installed on your system.
- Npm 9.3 or higher installed on your system.
- Access to the Nylas API key and clientId by using a Nylas Sandbox.
- Access to the openAI API key.

### Installation

1. Clone the Mosaic repository to your local machine:

   ```bash
   git clone https://github.com/JoSeTe4ever/LLMozaic
   ```

2. Navigate to the project directory:

   ```bash
   cd LLMozaic
   ```

3. Install the required dependencies in the different folders,:
  for backend 
   ```bash
   pip install -r requirements.txt
   ```
  for frontend 
   ```bash
   npm install
   ```
  for backend_node
  ```bash
   npm install
  ```

1. Configure Nylas API keys by creating a .env file with the first 4 values to be filled: 
   
  ```bash
    OPEN_API_KEY=
    NYLAS_CLIENT_ID=
    NYLAS_CLIENT_SECRET=
    NYLAS_RUNTIME_AUTH_KEY=
    NYLAS_API_SERVER=https://api.nylas.com
    FLASK_APP=server.py
  ```

1. Start Mosaic:

   ```bash
   python main.py
   ```

## Usage

Mosaic is designed to be user-friendly and intuitive. Once you have it up and running, interact with your virtual assistant by simply typing or speaking your requests. Mosaic will process your instructions and assist you with email, calendar, and contact management.

Feel free to explore the customization options and make Mosaic your own.







https://github.com/JoSeTe4ever/LLMozaic/assets/8459933/8526f7e1-c95a-462b-ad47-51d8020a4217



## Contributing

We welcome contributions from the open-source community. If you'd like to contribute to Mosaic's development, please follow our [contribution guidelines](CONTRIBUTING.md).

## License

Mosaic is released under the [MIT License](LICENSE). Feel free to use, modify, and distribute this software in accordance with the terms of the license.

Thank you for choosing Mosaic as your virtual assistant. We hope it revolutionizes the way you manage your email, calendar, and contacts! If you have any questions or feedback, please don't hesitate to reach out to our support team.

Happy organizing!

[Visit our website](https://www.mosaicassistant.com) | [Contact Support](mailto:support@mosaicassistant.com)

#brainstorming

- https://medium.com/devgauge/create-your-own-custom-tailored-ai-powered-personal-assistant-using-langchainagentfactory-8573cc2f67bc
- Define several tools actions in LangChain (e.g. translate, summarize, check my calendar for free spots and send-email with meeting proposals, etc.)
- https://raw.githubusercontent.com/tjperry07/spec-testing/master/api.yaml  NYLAS OPEN API DEF
- https://www.geeksforgeeks.org/build-chatbot-webapp-with-langchain/ tutorial para leer. Básicamente es eso lo que queremos.
- https://github.com/langchain-ai/langchain/issues/4884 Para ver código Langchain un poco más avanzado.
- https://blog.langchain.dev/structured-tools/ hay que leer esto
- https://developer.nylas.com/docs/calendar/parse-contacts-from-events/
- https://github.com/zahidkhawaja/langchain-chat-nextjs para el frontend
- Langsmith para hacer testing y debugging de la applicacion 
- https://blog.langchain.dev/conversational-retrieval-agents/
- https://www.pinecone.io/learn/series/langchain/langchain-agents/
- https://www.kaggle.com/code/robalaban/using-langchain-to-query-google-calendar-events/notebook
- https://www.piesocket.com/websocket-tester FOR testing websocket
- https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API for speech2text
- https://artificialcorner.com/how-to-build-tool-using-agents-with-langchain-d9fa9674b6c7
- https://stackoverflow.com/questions/76329949/i-cant-get-the-langchain-agent-module-to-actually-execute-my-prompt
- https://codepen.io/lxls/project/editor/ZKKBJa for specch2text
- https://github.com/addpipe/simple-recorderjs-demo esta es la mejor demo.
- https://gist.github.com/pixeline/6d57e68aa6c1357b14c14fe8e3b4b963#deploy-docker-compose-on-digitalocean
- https://app.diagrams.net/
viajeroeneltiempo84@gmail.com


## CREATIVE

- https://shots.so/ for creating the video.
- https://ideogram.ai/ for creating the logo
- http://animista.net for web animations

##TODO

- [ ] Set the authorization header in the request dynamically from the frontend.
- [] This model's maximum context length is 4097 tokens. However, your messages resulted in 4827 tokens. Please reduce the length of the messages. Langchain https://www.reddit.com/r/LangChain/comments/13rmn5u/maximum_context_length_is_4097_tokens/

## PROMPT EXAMPLES: 

- Summarize the last email I received regarding Silicon Valley Bank. Send the summary to the #test-zapier channel in slack.
- Send a happy birthday email to my friend John Doe with a picture of a cake.
- read my last email
- respond to this email sender saying that XXX
- When is the best time to schedule a one hour workout
- Get all my events from now until next week (or next month)

## INSTALL

backend_node 

 - npm i 
  
backend 

 - pip -r install requirements.txt

frontend
    
  - npm i

the file .env must be in backend root and backend_node root 

Speech2text whisper requires the following 
# on Ubuntu or Debian
sudo apt update && sudo apt install ffmpeg

# on Arch Linux
sudo pacman -S ffmpeg

# on MacOS using Homebrew (https://brew.sh/)
brew install ffmpeg

# on Windows using Chocolatey (https://chocolatey.org/)
choco install ffmpeg

# on Windows using Scoop (https://scoop.sh/)
scoop install ffmpeg

## RUN 

go to the proper folder, and for each one run:
  frontend npm run start 
  backend_node npm run start 
  backend python server.py


# EMAILS 

hthon898@gmail.com
fargallotest@gmail.com
viajeroeneltiempo84@gmail.com 
blackstartimetraveller@gmail.com


# VERSIONS 

Python 3.11.1 (tags/v3.11.1:a7a450f, Dec  6 2022, 19:58:39) [MSC v.1934 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.

 node -v
v18.13.0


# deployment 


http://146.190.113.226:1025/




