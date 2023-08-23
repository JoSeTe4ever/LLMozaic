from langchain.llms import OpenAI
from langchain.agents import initialize_agent, load_tools
from langchain import PromptTemplate
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.tools import BaseTool
from langchain_tools import SendEmailToolWithTemplate
import requests
import dotenv
import os

dotenv.load_dotenv()
OPEN_API_KEY = os.getenv("OPEN_API_KEY");
openAILLM = ChatOpenAI(openai_api_key=OPEN_API_KEY, temperature=0, model_name="gpt-3.5-turbo")
tools = [load_tools(['human']), SendEmailToolWithTemplate()];
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
