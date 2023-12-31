from langchain.tools import BaseTool
from urllib.parse import quote

import requests
import os
import datetime

BACKEND_NODE_URL = os.environ.get('BACKEND_NODE_URL', 'http://localhost:9000')


class CreateEvent(BaseTool):
    name = "create_event"
    description = """Useful for when you need to create an event. Use this action for creating an event.
    This action needs a calendarId that can be retrieved from the context of the conversation. StartsAfter and endsBefore are integers which are timestamp 
    representation from dates obtained.Participants is an array of strings, the participant info can be obtained from GetContactDetailsById tool or GetContacts tool.
    The action is sucessfully completed if the response holds 200"""


    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId

    def _run(self, eventSummary: str, startsTimestamp: str, endsTimestamp: str, calendarId: str, location: str = 'Not defined'
             , participants = [{"email": "undefined"}]) -> str:
        url = f"{BACKEND_NODE_URL}/nylas/create-events"
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


class ModifyEvent(BaseTool):
    name = "modify_event"
    description = """ Useful for when you need to modify an event. Use this action for modifying an event.
    This action needs a calendarId that can be retrieved from the tool get_calendars. The other parameters are the same as the create_event tool, 
    and can be retrieved from the context of the conversation. The action is sucessfully completed if the response holds 200 and a json object"""

    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId


    def _run(self, id: str, notify_participants: bool, title: str, description: str, startTime: str = 'Not defined',
            endTime: str = 'Not defined' , participants = [{"email": "undefined"}]) -> str:

        url = f"{BACKEND_NODE_URL}/nylas/update-event"
        json_data = {
            "id": id,
            "notify_participants": notify_participants,
            "title": title,
            "description": description,
            "startTime": startTime,
            "endTime": endTime,
            "participants": participants
        }
        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.put(url, json=json_data, headers=headers)
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


    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId

    def _run(self, calendarId: str, startsAfter: str, endsBefore: str) -> str:
        url = f"{BACKEND_NODE_URL}/nylas/read-events"

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


class CreateCalendar(BaseTool):
    name = "create_calendar"
    description = """Useful for when you need to create a calendar with name and description.
    timezone format entered must be supported by the IANA timezone spec. Use this action for creating a new calendar. 
    This tool returns an object. This object has an id"""
    
    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId

    def _run(self, name: str, description: str, location: str, timezone: str) -> str:   
        url = f"{BACKEND_NODE_URL}/nylas/create-calendar"
        
        json_data = {
            "name": name,
            "description": description,
            "location": location,
            "timezone": timezone
        }

        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.post(url, json=json_data, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("create_calendar does not support async")


class GetCalendars(BaseTool):
    name = "get_calendars"
    description = """Useful for when you need to recieve the information of the calendars in json format.
      Use this action for retrieving all the calendars. Use this action for getting all the calendars associated"""
    
    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId


    def _run(self) -> str:
        url = f'{BACKEND_NODE_URL}/nylas/read-calendars'

# Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.get(url, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("get_calendars does not support async")


class DeleteCalendar(BaseTool):
    name = "delete_calendar"
    description = """Useful for when you need to delete a calendar, identified by its id.
    Use this action for deleting a calendar. This tool returns an object but it is not important for the user."""
    
    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId


    def _run(self, calendar_id: str) -> str:
        url = f'{BACKEND_NODE_URL}/nylas/delete-calendar?calendarId={calendar_id}'
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.delete(url, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("delete_calendar does not support async")


class GetContacts(BaseTool):
    name = "get_contacts"
    description = "Useful for when you need to recieve the information of all the contacts in json format. Use this action for retrieving all the contacts."

    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId

    def _run(self) -> str:
        url = f'{BACKEND_NODE_URL}/nylas/contacts'

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

    
    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId

    def _run(self, contact_id: str) -> str:
        url = f"""{BACKEND_NODE_URL}/nylas/contacts/{contact_id}"""

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

    
    NYLAS_RUNTIME_AUTH_KEY = ""

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId

    def _run(self) -> str:
        url = f'{BACKEND_NODE_URL}/nylas/read-emails'
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
    The tool expects only the actual value, not a complex object for each parameter.
    The action is sucessfully completed if the response holds 200"""

    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId

    def _run(self, to, sender: str, summary: str, body: str) -> str:
        url = f'{BACKEND_NODE_URL}/nylas/send-email'

        # Genera el JSON a partir del prompt y ejecuta la cadena
        json_data = {
            "to": to,
            "subject": summary,
            "body": body
        }

        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        print(json_data)
        response = requests.post(url, json=json_data, headers=headers)
        print(response)
        return response.json

    async def _arun(self, to, sender: str, summary: str, body: str) -> str:
        result = await self._run(to, sender, summary, body)
        return result


class GetEmailDrafts(BaseTool):
    name = "get_drafts_emails"
    description = """Useful for when you need to recieve the information of the emails that are in draft in json format.
      Use this action for retrieving all the drafts."""

    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId


    def _run(self) -> str:
        url = f"{BACKEND_NODE_URL}/nylas/read-drafts"

        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.get(url, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("get_drafts_emails does not support async")
    

class CreateEmailDraft(BaseTool):
    name = "create_draft_email"
    description = """Useful for when you need to create emails in draft that will be sent later.
      Use this action for retrieving all the drafts. This tool returns an object. This object has an id 
      that is the id of the draft. This id is useful for when you need to send the email draft."""
    
    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId

    def _run(self, to: str, subject: str, body: str) -> str:

        json_data = {
            "to": to,
            "subject": summary,
            "body": body
        }

        url = f"{BACKEND_NODE_URL}/nylas/create-draft"
        
        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.post(url, json=json_data, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("create_draft_email does not support async")
    

class DeleteEmailDraft(BaseTool):
    name = "delete_email_draft"
    description = """Useful for when you need to delete an email draft, identified by its id.
    Use this action for deleting an email draft. This tool returns an object but it is not important for the user."""
    
    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId


    def _run(self, email_draft_id: str) -> str:
        url = f'{BACKEND_NODE_URL}/nylas/delete-draft?draftId={email_draft_id}'
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.delete(url, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("get_calendars does not support async")


class CreateContact(BaseTool):
    name = "create_contact"
    description = """Useful for when you need to create a new contact.
      Use this action for creating a new contact. This tool returns an object. This object has an id 
      that is the id of the contact. This id is useful for when you need to get the contact details."""
    
    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId

    def _run(self, givenName: str, middleName: str = "", surname: str = ""
             , suffix: str = "", nickname: str = "", birthday: str = ""
             , jobTitle: str = "", officeLocation: str = "", notes: str = ""
             , pictureUrl: str = "", email: str = "") -> str:
        
        json_data = {
            "givenName": givenName,
            "middleName": middleName,
            "surname": surname,
            "suffix": suffix,
            "nickname": nickname,
            "birthday": birthday,
            "jobTitle": jobTitle,
            "officeLocation": officeLocation,
            "notes": notes,
            "pictureUrl": pictureUrl,
            "email": email
        }
        
        url = f"{BACKEND_NODE_URL}/nylas/create-contact"
        
        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.post(url, json=json_data, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("create_contact does not support async")
    

class SendEmailDraft(BaseTool):
    name = "send_email_draft"
    description = """Useful for when you need to send an email in draft.
      Use this action for sending an email that has been previously created and saved as draft. The needed parameter is the id of the draft"""
    
    NYLAS_RUNTIME_AUTH_KEY = ''

    def __init__(self, userId):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        self.NYLAS_RUNTIME_AUTH_KEY = userId

    def _run(self, id: str) -> str:   
        url = f"{BACKEND_NODE_URL}/nylas/send-draft?draftId={id}"
        
        # Configura encabezados y envía la solicitud
        headers = {'Authorization': self.NYLAS_RUNTIME_AUTH_KEY}
        response = requests.get(url, headers=headers)
        return response.json();

    async def _arun(self) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("get_calendars does not support async")
    

class CreateImage(BaseTool):
    name = "create_image"
    description = """Use this action for creating an image from a text. The text is the prompt. The image is returned as a url. Always use 
    the url response string in the action chain."""

    def __init__(self):
        super().__init__()  # Llama al constructor de la clase base si es necesario
        

    def _run(self, prompt: str) -> str:
        print(prompt);
        encoded_text = quote(prompt)

        url = f"http://localhost:5000/text2img?prompt={encoded_text}"
        
        # Configura encabezados y envía la solicitud
        imgUrl = requests.get(url)
        print(imgUrl, "imgUrl")
        return imgUrl.json();

    async def _arun(self, prompt) -> str:
        result = await self._run(prompt)
        return result