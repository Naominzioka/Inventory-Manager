#routes go here
from flask_jwt_extended import create_access_token, get_jwt_identity, verify_jwt_in_request
from flask import request, jsonify, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import app, db, jwt, api
from models import User, Role
from schema import UserSchema

#setup endpoints
@app.before_request  #protected routes
def check_if_logged_in():
    open_access_list = ['signup', 'login']
    
    if request.endpoint in open_access_list:
        return None
    try:
        verify_jwt_in_request()
    except Exception:
        return make_response(jsonify({'errors': ['401 Unauthorized']}), 401) #stops any request without a valid token
    
    
#new user endpoint    
class Signup(Resource):
    def post(self):
        request_json = request.get_json()
        
        username = request_json.get('username')
        password = request_json.get('password')
        email = request_json.get('email')
        
        new_user = User(
            username=username,
            email=email
        )
        new_user.password_hash=password
        try:
            db.session.add(new_user)
            db.session.commit()
            access_token = create_access_token(identity=str(new_user.id))  #converts user id to string for JWT identity payload
            return make_response(jsonify(token=access_token, user=UserSchema().dump(new_user)), 201)
        except IntegrityError:
            return make_response(jsonify({'errors': ['User already exists or data is invalid']}), 422) #prevents duplicate usernames or emails from crashing the server

#login route
class Login(Resource):
    def post(self):
        username = request.get_json()['username']
        password = request.get_json()['password']
        
        user = User.query.filter(User.username == username).first()
        if user and user.authenticate(password):
            token = create_access_token(identity=str(user.id))
            return make_response(jsonify(token=token, user=UserSchema().dump(user)), 200)
        
        return make_response(jsonify({'errors': ['Invalid username or password']}), 401)
    

class WhoAmI(Resource):
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return make_response(jsonify({'errors': ['User not found']}), 404)
        
        return make_response(jsonify(UserSchema().dump(user)), 200)
    

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(WhoAmI, '/whoami')

if __name__ == '__main__':
    app.run(port=5555, debug=True)