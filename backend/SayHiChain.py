from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

import dotenv
import os
import sys

dotenv.load_dotenv()
OPEN_API_KEY = os.getenv("OPEN_API_KEY");

class SayHiChain(LLMChain):
    def __init__(self):
        llm = OpenAI(openai_api_key=OPEN_API_KEY, temperature=0.8, model_name="gpt-4")
        prompt = PromptTemplate(
            input_variables=["unread_emails"],
            template="""You are an personal assistant, You must create a fun welcome message to the user saying how many email they got -
            Something like 'Hey user, you have {unread_emails} unread emails today!' """,
        )
        super().__init__(llm=llm, prompt=prompt, verbose=True)