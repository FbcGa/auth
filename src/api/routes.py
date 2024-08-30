"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def register():
    body = request.json
    email = body.get("email", None)
    password = body.get("password", None)

    if email is None or password is None:
        return jsonify({"error":"fill all the blanks"}), 400
    
    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error": "email already exist"}), 400
    
    password_hash = generate_password_hash(password)
    try:
        new_user = User(email=email, password=password_hash)
        db.session.add(new_user)
        db.session.commit()
        db.session.refresh(new_user)
        return jsonify({"mssg": "user create successfully"}),200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":f"{e}" }),500
    
@api.route('/signin', methods=['POST'])
def login():
    try:
        body = request.json
        email = body.get("email", None)
        password = body.get("password", None)

        if email is None or password is None:
            return jsonify({"error":"fill all the blanks"}), 400

        user = User.query.filter_by(email=email).first()    
        if not user or not check_password_hash(user.password, password):
            return jsonify({"error": "wrong data"}),400
        
        return jsonify({"mssg": "user login"}),200
    except Exception as e:
        return jsonify({"error": f"{e}"})
        


