import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import re
from transformers import AutoModelForCausalLM, AutoTokenizer
from flask import Flask, render_template, request
import sys, json

nltk.data.path.append('/home/bhupi/nltk_data')  # Specify custom path if needed
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    print("NLTK data downloaded successfully.")
    
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')
    print("NLTK data downloaded successfully.")

# Load NLTK data
nltk.download('stopwords')

# Load the CSV file into a DataFrame
dataset_path = "./customdata.csv"
df = pd.read_csv(dataset_path)

# Load the Hugging Face model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small")

# Function to preprocess text
def preprocess_text(text):
    if not isinstance(text, str):
        text = ''  # or provide a default value
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words("english"))
    print(stop_words) #print the stop words
    filtered_tokens = [word for word in tokens if word not in stop_words]
    return ' '.join(filtered_tokens)

# Function to search for an answer in the dataset
def find_answer_in_dataset(user_input):
    for i, row in df.iterrows():
        question = preprocess_text(row['Questions'])
        if question == preprocess_text(user_input):
            return row['Answers']
    return None

# Function to get a response from DialoGPT if no answer is found in the dataset
def get_dialogpt_response(prompt):
    # Encode the input and generate a response
    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
    
    # Get the input tensor and attention mask
    input_ids = inputs["input_ids"]
    attention_mask = inputs["attention_mask"]
    
    # Generate a reply using the input_ids and attention_mask
    reply_ids = model.generate(input_ids, attention_mask=attention_mask, max_length=100, pad_token_id=tokenizer.eos_token_id)
    
    # Decode the response from the model
    response = tokenizer.decode(reply_ids[0], skip_special_tokens=True)
    
    return response

# Function to add a new question-answer pair to the dataset
def add_to_dataset(question, answer):
    global df
    new_data = pd.DataFrame([[question, answer]], columns=['Questions', 'Answers'])
    df = pd.concat([df, new_data], ignore_index=True)
    df.to_csv(dataset_path, index=False)

def chat(prompt):
    user_input = prompt
    # Check for an answer in the dataset
    answer = find_answer_in_dataset(user_input)
    
    if answer:
        bot_response = answer
    else:
        # Get a response from DialoGPT
        try:
            bot_response = get_dialogpt_response(user_input)
        except Exception as e:
            bot_response = "Sorry, I couldn't understand your question. Can you rephrase?"
    
    # Add the new question-answer pair to the dataset if no answer found
    if not answer:
        add_to_dataset(user_input, bot_response)
    
if __name__ == '__main__':
    data = json.loads(sys.stdin.read())  # Read input from Node.js
    prompt = data.get('prompt')
    response = chatbot_response(prompt)
    print(json.dumps({'response': response})) 
    # app.run(debug=True)