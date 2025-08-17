# app.py
from flask import Flask, request, jsonify, render_template
import os
import openai

# Optional: use python-dotenv in development to load .env
# from dotenv import load_dotenv
# load_dotenv()

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY environment variable is not set. Set it before running the app.")

openai.api_key = OPENAI_API_KEY

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    return render_template('index.html')

# Simple search endpoint (placeholder: you can implement DB-based search)
@app.route('/search', methods=['POST'])
def search():
    data = request.get_json(silent=True) or {}
    query = data.get('query','').strip()
    # Dummy response: real implementation would search your tool/service data store
    return jsonify({"status":"success", "query": query, "results_count": 0})

# Ask endpoint - forwards prompt to OpenAI (server-side only)
@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json(silent=True) or {}
    prompt = data.get('prompt','').strip()
    if not prompt:
        return jsonify({"status":"error","message":"No prompt provided"}), 400

    try:
        # Using ChatCompletions (gpt-3.5-turbo). Adjust model as you prefer and as your account allows.
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role":"system","content":"You are a helpful assistant that generates short, user-friendly homepage copy and tool descriptions."},
                {"role":"user","content": prompt}
            ],
            max_tokens=300,
            temperature=0.7,
        )
        text = response.choices[0].message.content.strip() if response.choices else ""
        return jsonify({"status":"success","response": text})
    except Exception as e:
        return jsonify({"status":"error","message": str(e)}), 500

if __name__ == '__main__':
    # For production: run under a proper WSGI server (gunicorn / uvicorn) and configure env vars.
    app.run(host='0.0.0.0', port=5000, debug=True)
