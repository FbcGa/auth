"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Post
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
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
        user_token = create_access_token({"id": new_user.id, "email": new_user.email, "password": new_user.password})
        return jsonify({"mssg":"user register","token": user_token}),200
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
        
        user_token = create_access_token({"id": user.id, "email": user.email, "password": user.password})
        return jsonify({"mssg":"user login", "token": user_token}),200
    except Exception as e:
        return jsonify({"error": f"{e}"}),500

@api.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    body = request.json
    user_data = get_jwt_identity()
    comment = body.get("comment", None)

    if comment is None:
        return jsonify({"error": "fill the post"})
    try:
        new_post = Post(comment=comment, user_id=user_data['id'])
        db.session.add(new_post)
        db.session.commit()
        db.session.refresh(new_post)
        return jsonify({"post": new_post.serialize()}),201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}),500

@api.route('/get', methods=['GET'])
@jwt_required()
def get_post():
    try:
        user_data = get_jwt_identity()
        all_post = Post.query.filter_by(user_id = user_data['id']).all()
        serialize_post = [post.serialize() for post in all_post]
        return jsonify({"post": serialize_post}),200
    except Exception as error:
        return jsonify({"error": f"{error}"}),500

@api.route('/post/delete', methods=['DELETE'])
@jwt_required()
def delete_post():
    user_data = get_jwt_identity()
    body = request.json
    post_id = body.get("post_id", None)
    post_delete = Post.query.filter_by(id = post_id, user_id=user_data['id'] ).first()
    try:
        db.session.delete(post_delete)
        db.session.commit()
        return jsonify({"mssg" : "delete post"})
    except Exception as error:
        return jsonify({"error" : f"{error}"}),500

@api.route("/me", methods=['GET'])
@jwt_required()
def get_user_data():
    try:
        user_data = get_jwt_identity()
        user_post = User.query.filter_by(id=user_data['id']).first()
        return jsonify(user_post.serialize()),200
    except Exception as e:
        return jsonify({"error": f"{e}"}),500