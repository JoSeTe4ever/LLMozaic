

Install the following packages:

```
pip install dotenv
pip install langchain
pip install transformers
pip install torch
pip install pillow
```

#notes 

- In langchain there are sequentialChains that allows multiple inputs and outputs.
- In langchain there are simpleSequentialChains that allows multiple inputs and outputs.

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
viajeroeneltiempo84@gmail.com


## CREATIVE

- https://shots.so/ for creating the video.
- https://ideogram.ai/ for creating the logo

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