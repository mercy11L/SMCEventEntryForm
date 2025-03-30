
from flask import Flask,request,jsonify;
from flask_cors import CORS

app=Flask(__name__);
CORS(app)

@app.route('/submit',methods=['POST'])
def submit():
    name=request.form.get('name');
    email=request.form.get('email');
    return jsonify({"message": "Data received successfully", "name": name, "email": email})

# @app.route('/')
# def Home():
#     return 'Hello';

if __name__=='__main__':
    app.run(debug=True);
#"proxy": "http://localhost:5000",

