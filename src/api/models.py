from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(300), unique=False, nullable=False)

    post = db.relationship('Post', backref='user')
    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String(400), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id') ,nullable=False)

    def __repr__(self):
        return f'<Post {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "comment": self.comment,
            "user_id": self.user_id
            # do not serialize the password, its a security breach
        }
    
