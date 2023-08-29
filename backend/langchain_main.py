from langchain.agents import initialize_agent, load_tools
from langchain.chat_models import ChatOpenAI
from langchain_tools import SendEmail, ReadEmails, GetContacts, GetEvents, GetCalendars
from langchain.prompts import MessagesPlaceholder
from langchain.memory import ConversationBufferMemory

import dotenv
import os

dotenv.load_dotenv()
OPEN_API_KEY = os.getenv("OPEN_API_KEY");
openAILLM = ChatOpenAI(openai_api_key=OPEN_API_KEY, temperature=0, model_name="gpt-3.5-turbo")
tools = [load_tools(['human']), SendEmail()];

chat_history = MessagesPlaceholder(variable_name="chat_history")
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)


agent = initialize_agent(tools=[SendEmail(), ReadEmails(), GetContacts(), GetEvents(), GetCalendars()] , llm=openAILLM, 
        agent="structured-chat-zero-shot-react-description", agent_kwargs={
        "memory_prompts": [chat_history],
        "input_variables": ["input", "agent_scratchpad", "chat_history"]},
        memory=memory,
        verbose=True)


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
