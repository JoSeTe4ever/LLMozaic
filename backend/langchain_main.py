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
openAILLM = ChatOpenAI(openai_api_key=OPEN_API_KEY, temperature=0.7, model_name="gpt-3.5-turbo")
tools = [load_tools(['human'])];

chat_history = MessagesPlaceholder(variable_name="chat_history")
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

def message(user_input: str):
    return agent.run(user_input)

# process_data.py
def main():
        # prompt the user for input
        user_input = sys.argv[1]
        userId = sys.argv[2];
        print(f"Valor del parámetro 'userId': {userId}")
        agent = initialize_agent(tools=[SendEmail(userId), ReadEmails(userId), GetContacts(userId), GetEvents(userId), GetCalendars(userId),
                                         CreateModifyDeleteEvents(userId), DateTimestamp()] , llm=openAILLM, 
        agent="structured-chat-zero-shot-react-description", agent_kwargs={
        "memory_prompts": [chat_history],
        "input_variables": ["input", "agent_scratchpad", "chat_history"]},
        memory=memory,
        verbose=True)

        agent.run(user_input)

if __name__ == "__main__":
    main()