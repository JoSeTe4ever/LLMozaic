from langchain.llms import OpenAI
from langchain import PromptTemplate
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.tools import BaseTool, StructuredTool

import requests
import dotenv
import os
import json


class GetEvents(BaseTool):
    name = "get_events"
    description = "Useful for when you need to recieve the information of all the events"

    dotenv.load_dotenv()
    NYLAS_RUNTIME_AUTH_KEY = os.getenv("NYLAS_RUNTIME_AUTH_KEY")

    def _run(self) -> str:
        url = 'http://localhost:9000/nylas/read-events'
        
        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.get(url, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        reponse = await requests.get(url, headers=headers);
        return reponse.json();


class GetCalendars(BaseTool):
    name = "get_calendars"
    description = "Useful for when you need to recieve the information of the calendars in json format"

    dotenv.load_dotenv()
    NYLAS_RUNTIME_AUTH_KEY = os.getenv("NYLAS_RUNTIME_AUTH_KEY")

    def _run(self) -> str:
        url = 'http://localhost:9000/nylas/read-calendars'
        
        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.get(url, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        reponse = await requests.get(url, headers=headers);
        return reponse.json();

class GetContacts(BaseTool):
    name = "get_contacts"
    description = "Useful for when you need to recieve the information of all the contacts in json format"

    dotenv.load_dotenv()
    NYLAS_RUNTIME_AUTH_KEY = os.getenv("NYLAS_RUNTIME_AUTH_KEY")

    def _run(self) -> str:
        url = 'http://localhost:9000/nylas/contacts'
        
        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.get(url, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        reponse = await requests.get(url, headers=headers);
        return reponse.json();

class ReadEmails(BaseTool):
    name = "read_emails"
    description = "Useful for when you need to recieve or to read the latest emails from your inbox in json format"

    dotenv.load_dotenv()
    NYLAS_RUNTIME_AUTH_KEY = os.getenv("NYLAS_RUNTIME_AUTH_KEY")

    def _run(self) -> str:
        url = 'http://localhost:9000/nylas/read-emails'
        
        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.get(url, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        reponse = await requests.get(url, headers=headers);
        return reponse.json();


class SendEmail(BaseTool):
    name = "send_email_with_template"
    description = "Useful for when you need to send an email to one person or several people. It calls POST /nylas/send-email with a proper JSON object." 

    # Plantilla JSON para el prompt
    json_object_template = """
    Create a json object that looks like
    {{
        "object": "draft",
        "subject": "{topicEmail}",
        "to": "{toEmail}",
        "body": "{bodyEmail}",
        "from": "{fromEmail}",
        "isOpen": true
    }}
    """

    dotenv.load_dotenv()
    OPEN_API_KEY = os.getenv("OPEN_API_KEY")
    NYLAS_RUNTIME_AUTH_KEY = os.getenv("NYLAS_RUNTIME_AUTH_KEY")

    json_prompt = PromptTemplate(template=json_object_template, input_variables=["topicEmail", "toEmail", "bodyEmail", "fromEmail"])
    openAILLM = ChatOpenAI(openai_api_key=OPEN_API_KEY, temperature=0, model_name="gpt-3.5-turbo")
    chain = LLMChain(llm=openAILLM, prompt=json_prompt)

    def _run(self, to, sender: str, summary: str, body: str) -> str:
        url = 'http://localhost:9000/nylas/send-email'
        
        # Genera el JSON a partir del prompt y ejecuta la cadena
        json_data = {
            "topicEmail": summary,
            "toEmail": to,
            "bodyEmail": body,
            "fromEmail": sender
        }
        json_string = self.chain.run(json_data)
        json_object = json.loads(json_string)

        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.post(url, json=json_object, headers=headers)
        print(response)
        return "Email sent"

    async def _arun(self, to, sender: str, summary: str, body: str) -> str:
        result = await self._run(to, sender, summary, body)
        return f"Sending email to {to}: {result}"
