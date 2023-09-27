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
- Salutation (with no name, you can use something generic like 'buddy') + "unreadThreadInfo-report" +  "eventsTodayMainCalendar-report" 
\n💡May I suggest:
  \n[Emoji] + Action Name
  \n[Emoji] + Action Name
\n[Emoji] + Action Name
"""

# Custom Chain


class SayHiChain(LLMChain):
    def __init__(self):
        llm = OpenAI(openai_api_key=OPEN_API_KEY,
                     temperature=0.8, model_name="gpt-3.5-turbo")
        prompt = PromptTemplate(
            input_variables=["eventsTodayMainCalendar","unreadThreadInfo" ],
            template=f"""You are a personal assistant. You must create a fun welcome message to the user saying how many emails they got.
            In order to give "unreadThreadInfo-report", you need to understand the content of{{unreadThreadInfo}} and see if there anything you consider important to mention, if so please mention who is the sender, but do not display a full email address. Its ok, if nothing seems important, you can simply skip to the next line. never exceed 3 emails and exclude all generic google security alers.
            
            In order to give the "eventsTodayMainCalendar-report" you need to mention the ammount of events in {{eventsTodayMainCalendar}} and make a joke about that.
         
            When you finish with the update, you should also offer the user a list of possible actions that they can do with you.
            The actions you offer to do, should be related to the the content of your previous reports about emails and events.
            Try to be very helpfull as a good personal assistant

     
            Plase use this output format:
            {output_format}
            """
        )
        super().__init__(llm=llm, prompt=prompt, verbose=True)
