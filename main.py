from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/beginner')
def beginner_game():
    return render_template('index.html', title='蜂勤昀友配對消消樂 - 初階')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
