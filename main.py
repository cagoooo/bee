from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', title='蜂勤昀友配對消消樂')

@app.route('/static/audio/<path:filename>')
def serve_audio(filename):
    return send_from_directory(os.path.join(app.root_path, 'static', 'audio'), filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
