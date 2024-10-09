from flask import Flask, render_template, request, jsonify
import openai
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_version = "2023-05-15"
openai.api_key = os.getenv("AZURE_OPENAI_KEY")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json['message']
    
    response = openai.ChatCompletion.create(
        engine=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_message}
        ]
    )
    
    bot_response = response['choices'][0]['message']['content']
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)