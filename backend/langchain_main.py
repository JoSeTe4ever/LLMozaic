from langchain.agents import initialize_agent, load_tools
from langchain.chat_models import ChatOpenAI
from langchain_tools import SendEmail, ReadEmails, GetContacts, GetEvents, GetCalendars, DateTimestamp, CreateModifyDeleteEvents
from langchain.prompts import MessagesPlaceholder
from langchain.memory import ConversationBufferMemory

import dotenv
import os
import sys

dotenv.load_dotenv()
OPEN_API_KEY = os.getenv("OPEN_API_KEY");
openAILLM = ChatOpenAI(openai_api_key=OPEN_API_KEY, temperature=0.9, model_name="gpt-4")
tools = [load_tools(['human'])];

chat_history = MessagesPlaceholder(variable_name="chat_history")
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

PREFIX = '''
You act as a Virtual Assistant, designed to make digital life easier and more organized. 
        Think of me as your personal aide in the digital realm,
        capable of handling various tasks. Task like reading emails, sending emails, handling calendars and contacts,
        using your available. Use actions for your tasks. The actions you can use are 

['send_email_with_template', 'read_access_get_emails', 'get_contacts', 'get_events', 'get_calendars', 'create_modify_delete_events', 'date_timestamp']


'''

FORMAT_INSTRUCTIONS = """To use a tool, please use the following format:
'''
Thought: Do I need to use a tool? Yes
Action: the action to take, should be one of ['send_email_with_template', 'read_access_get_emails', 'get_contacts', 'get_events', 'get_calendars', 'create_modify_delete_events', 'date_timestamp']
Action Input: the input to the action
Observation: the result of the action
'''

'''
When you have gathered all the information and finished use the following format.
Thought: Do I need to use a tool? No
AI: [the response here]
'''
"""

SUFFIX = '''

Begin!

Previous conversation history:
{chat_history}

Instructions: {input}

{agent_scratchpad}
'''

def message(user_input: str):
    return agent.run(user_input)

# process_data.py
def main():
        # prompt the user for input
        user_input = sys.argv[1]
        userId = sys.argv[2];
        print(f"Valor del parámetro 'userId': {userId}")
        tools=[SendEmail(userId), ReadEmails(userId), GetContacts(userId), GetEvents(userId), GetCalendars(userId),
                                         CreateModifyDeleteEvents(userId), DateTimestamp()]
        
        agent = initialize_agent(tools=tools , llm=openAILLM, 
        agent="structured-chat-zero-shot-react-description", agent_kwargs={
        "input_variables": ["input", "agent_scratchpad"]},
        memory=memory,
        verbose=True)

        tool_names = [tool.name for tool in tools]
        print(tool_names)
        agent.run(user_input)

if __name__ == "__main__":
    main()