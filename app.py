from dotenv import find_dotenv, load_dotenv
from transformers import pipeline

load_dotenv(find_dotenv())

# define a function called img2text that accepts one parameter string called url 
def img2text(url):
    image_to_text = pipeline("image-to-text", model="Salesforce/blip-image-captioning-large")
    return image_to_text(url)

# call the img2text function with an image in the same folder
result_text = img2text("thing.jpg")[0]['generated_text'];

print(result_text)