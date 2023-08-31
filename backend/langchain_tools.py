from langchain.llms import OpenAI
from langchain import PromptTemplate
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.tools import BaseTool, StructuredTool

import requests
import dotenv
import os
import json
import datetime


class CreateModifyDeleteEvents(BaseTool):
    name = "create_modify_delete_events"
    description = """Useful for when you need to create, modify or delete an event. Use this action for creating, modifying or deleting an event.
    This action needs a calendarId that can be retrieved from the context of the conversation. This Id should be obtained from the list of
    calendars (it is the id field of the json object)). StartsAfter and endsBefore are integers which are timestamp representation from dates obtained
    using dateTimestamp tool. Participants is an array of strings, the participant info can be obtained from GetContactDetailsById tool or GetContacts tool.
    The action is sucessfully completed if the response holds 200"""


    dotenv.load_dotenv()
    OPEN_API_KEY = os.getenv("OPEN_API_KEY")
    NYLAS_RUNTIME_AUTH_KEY = os.getenv("NYLAS_RUNTIME_AUTH_KEY")

    dotenv.load_dotenv()
    NYLAS_RUNTIME_AUTH_KEY = os.getenv("NYLAS_RUNTIME_AUTH_KEY")

    def _run(self, eventSummary: str, startsTimestamp: str, endsTimestamp: str, calendarId: str, location: str = 'Not defined'
             , participants = [{"email": "undefined"}]) -> str:
        url = 'http://localhost:9000/nylas/create-events'

        json_data = {
            "title": eventSummary,
            "startTime": startsTimestamp,
            "endTime": endsTimestamp,
            "calendarId": calendarId,
            "location": location,
            "participants": participants
        }
        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.post(url, json=json_data, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        reponse = await requests.get(url, headers=headers);
        return reponse.json();


class DateTimestamp(BaseTool):
    name = "date_timestamp"
    description = """useful for when you need to obtain timestamp from dates. This tool is usefull for obtainint the todays timestamp if the param days is 0. 
    This tool is also useful for getting timestamp of future days. One week in the future the param days is 7. One month in the future the param days is 30."""

    def _run(
        self, days: int) -> str:
        """Use the tool."""
        if(days == 0):
            return str(datetime.datetime.now().timestamp()).split(".")[0]
        else:
            return str((datetime.datetime.now() + datetime.timedelta(days=days)).timestamp()).split(".")[0]


    async def _arun(
        self, query: str,
    ) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("custom_search does not support async")

class GetEvents(BaseTool):
    name = "get_events"
    description = """Useful for when you need to recieve the information of all the events. Use this action for retrieving all the events.
    this action needs a calendarId that can be retrieved from the context of the conversation. This Id should be obtained from the list of 
    calendars (it is the id field of the json object)). StartsAfter and endsBefore are integers which are timestamp representation from dates obtained
    using dateTimestamp tool"""


    dotenv.load_dotenv()
    OPEN_API_KEY = os.getenv("OPEN_API_KEY")
    NYLAS_RUNTIME_AUTH_KEY = os.getenv("NYLAS_RUNTIME_AUTH_KEY")

    dotenv.load_dotenv()
    NYLAS_RUNTIME_AUTH_KEY = os.getenv("NYLAS_RUNTIME_AUTH_KEY")

    def _run(self, calendarId: str, startsAfter: str, endsBefore: str) -> str:
        url = 'http://localhost:9000/nylas/read-events'

        json_data = {
            "calendarId": calendarId,
            "startsAfter": startsAfter,
            "endsBefore": endsBefore,
            "limit": 20
        }

        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.post(url, json=json_data, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        reponse = await requests.get(url, headers=headers);
        return reponse.json();


class GetCalendars(BaseTool):
    name = "get_calendars"
    description = """Useful for when you need to recieve the information of the calendars in json format.
      Use this action for retrieving all the calendars. Use this action for getting all the calendars associated"""
    
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
    description = "Useful for when you need to recieve the information of all the contacts in json format. Use this action for retrieving all the contacts."

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


class GetContactDetailsById(BaseTool):
    name = "get_contact_details_by_id"
    description = """Useful for when you need to recieve the information of one specific contact in json format. Use this action for retrieving one contact by id."""

    dotenv.load_dotenv()
    NYLAS_RUNTIME_AUTH_KEY = os.getenv("NYLAS_RUNTIME_AUTH_KEY")

    def _run(self, contact_id: str) -> str:
        url = """http://localhost:9000/nylas/contacts/{contact_id}"""
        
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
    description = """Useful for when you need to send an email to one person or several people. Do not use this title type object, just the plain string which is the title value.
    The action is sucessfully completed if the response holds 200""" 

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
    openAILLM = ChatOpenAI(openai_api_key=OPEN_API_KEY, temperature=0, model_name="gpt-3.5-turbo-0613")
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
        print(json_object)
        response = requests.post(url, json=json_object, headers=headers)
        print(response)
        return response.json

    async def _arun(self, to, sender: str, summary: str, body: str) -> str:
        result = await self._run(to, sender, summary, body)
        return result
