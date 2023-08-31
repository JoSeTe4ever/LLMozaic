

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