from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

import dotenv
import os

# Load environment variables
dotenv.load_dotenv()
OPEN_API_KEY = os.getenv("OPEN_API_KEY")

# Constants

output_format = """
- Salutation (with no name, you can use something generic like 'buddy') + email number update + funny short satirical pun
- Possible actions

"""

# Custom Chain
class SayHiChain(LLMChain):
    def __init__(self):
        llm = OpenAI(openai_api_key=OPEN_API_KEY, temperature=0.8, model_name="gpt-3.5-turbo")
        prompt = PromptTemplate(
            input_variables=["unread_emails"],
            template=f"""You are a personal assistant. You must create a fun welcome message to the user saying how many emails they got.
            Something like 'Hey user, you have {{unread_emails}} unread emails today!'
            When you finish with the update, you should also offer the user a list of possible actions that they can do with you.      
            Also, always format your reply like this:
            {output_format}
            """
        )
        super().__init__(llm=llm, prompt=prompt, verbose=True)
