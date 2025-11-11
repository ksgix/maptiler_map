from flask import Flask, render_template
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    api_key = os.getenv("MAPTILER_API_KEY")
    if not api_key:
        print("Warning: MAPTILER_API_KEY environment variable not set.")

    return render_template('index.html', api_key=api_key)

if __name__ == '__main__':
    app.run(debug=True)