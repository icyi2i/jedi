# -*- coding: utf-8 -*-
# Librarys
from flask import Flask, render_template, request

# Variables
app = Flask(__name__)

# Settings
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'secret'


# Views
@app.route('/', methods=['GET'])
def index():
	if request.method == "GET":
		return render_template('index.html')
	else:
		return "<Editor content!>"

# Run
if __name__ == '__main__':
	app.run()