from langchain.llms import OpenAI
from langchain.agents import initialize_agent, load_tools
from langchain import PromptTemplate
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.tools import BaseTool
import requests
import dotenv
import os
import json

class SendEmailToolWithTemplate(BaseTool):
    name = "send_email_with_template"
    description = "Create an appoiment with someone"

    json_object_template= """
    Create a json object that looks like this
    {{
        "object":"draft",
        "subject": "{topicEmail}",
        "to": "{toEmail}",
        "body": "{bodyEmail}",
        "from": "{fromEmail}",
        isOpen": true
    }}
    """

    dotenv.load_dotenv()
    OPEN_API_KEY = os.getenv("OPEN_API_KEY");

    json_prompt = PromptTemplate(template=json_object_template, input_variables=["topicEmail", "toEmail", "bodyEmail", "fromEmail"])
    openAILLM = ChatOpenAI(openai_api_key=OPEN_API_KEY, temperature=0, model_name="gpt-3.5-turbo")

    # what is always running the model is a chain
    chain = LLMChain(llm=openAILLM, prompt=json_prompt);

    def _run(self, to: str, sender: str, topic: str ) -> str:
        url = 'http://localhost:9000/nylas/send-email'
        jsonString = self.chain.run({"topicEmail": topic, "toEmail": to, "bodyEmail": "This is the body of the email", "fromEmail": sender})
        jsonObject = json.loads(jsonString)
        print('objeto a enviar', jsonObject)
        headers = {'Authorization': '93765df7-9d23-45e1-901d-4b41a34e2a56'}
        response = requests.post(url, json=jsonObject, headers = headers)
        print('response', response)
        return "Sending email"
    
    async def _arun() -> str:
        return "Sending email to {text}"



dotenv.load_dotenv()
OPEN_API_KEY = os.getenv("OPEN_API_KEY");

openAILLM = ChatOpenAI(openai_api_key=OPEN_API_KEY, temperature=0, model_name="gpt-3.5-turbo")

agent = initialize_agent(tools=[SendEmailToolWithTemplate()], llm=openAILLM, agent="structured-chat-zero-shot-react-description", verbose=True)



if __name__ == "__main__":
    

    while True:
        # prompt the user for input
        user_input = input(">>> ")
        print(agent.run(user_input))

        # if the user types "exit" or "quit", break out of the loop
        if user_input.lower() in ["exit", "quit"]:
            break
        # otherwise, print the user input
        else:
            print(user_input)
