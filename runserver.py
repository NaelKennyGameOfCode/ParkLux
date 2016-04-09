from flask import Flask
from flask import render_template, redirect

app = Flask(__name__)

@app.route("/")
def hello():
    return render_template("index.html")

@app.route("/history")
def history():
    return render_template("history.html")
    
if __name__ == "__main__":
    app.run()
