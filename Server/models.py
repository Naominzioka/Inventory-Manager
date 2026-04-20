# models for the flask app
import re

from config import db, bcrypt
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String,unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    role = db.relationship('Role', back_populates='users')
    
    def __repr__(self):
        return f'<User {self.username},ID {self.id}>'
    
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')
        
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    #validations for email format
    @validates('email')
    def validate_user(self, key, value):
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if key == 'email':
            if value and not re.match(email_pattern, value):
                raise ValueError('Invalid email address format (e.g., user@example.com)')
        return value
            
            
class Role(db.Model):
    __tablename__ = "roles"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    
    users = db.relationship('User', back_populates='role')
    
    def __repr__(self):
        return f'<Role {self.name},ID {self.id}>'
    
    @validates('name')
    def validate_name(self, key, value):
        if not value:
            raise ValueError('Role name cannot be empty')
        categories = ['admin', 'employee', 'manager']
        if value not in categories:
            raise ValueError(f'Role name must be one of {categories}')
        return value
    
class Products(db.Model):
    __tablename__ = "products"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    category = db.relationship('Category', back_populates='products')

    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=True)
    supplier = db.relationship('Supplier', back_populates='products')

    stock_transactions = db.relationship('StockTransaction', back_populates='product')
    
    def __repr__(self):
        return f'<Product {self.name},ID {self.id}>'
    
    @validates('price', 'quantity', 'description')
    def validate_price(self, key, value):
        if key == 'price' and value < 0:
            raise ValueError('Price must be a positive number')
        if key == 'quantity' and value < 0:
            raise ValueError('Quantity must be a positive number')
        if key == 'description' and len(value) > 500:
            raise ValueError('Description cannot exceed 500 characters')
        return value
    
class Category(db.Model):
    __tablename__ = "categories"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    
    products = db.relationship('Products', back_populates='category')
    
    def __repr__(self):
        return f'<Category {self.name},ID {self.id}>'
    
    @validates('name')
    def validate_name(self, key, value):
        if not value:
            raise ValueError('Category name cannot be empty')
        valid_categories = ['electronics', 'clothing', 'food', 'furniture']
        if value not in valid_categories:
            raise ValueError(f'Category name must be one of {valid_categories}')
        return value


class Supplier(db.Model):
    __tablename__ = "suppliers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    phone = db.Column(db.String, nullable=True)

    products = db.relationship('Products', back_populates='supplier')

    def __repr__(self):
        return f'<Supplier {self.name}, ID {self.id}>'

    @validates('email', 'phone')
    def validate_email(self, key, value):
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if key == 'email':
            if value and not re.match(email_pattern, value):
                raise ValueError('Invalid email address format (e.g., user@example.com)')    
        if key == 'phone' and not value.isdigit():
            raise ValueError('Phone number must contain only digits')
        return value


class StockTransaction(db.Model):
    __tablename__ = "stock_transactions"

    id = db.Column(db.Integer, primary_key=True)
    transaction_type = db.Column(db.String, nullable=False)  # 'in' or 'out'
    quantity = db.Column(db.Integer, nullable=False)
    note = db.Column(db.String, nullable=True)
    date = db.Column(db.DateTime, nullable=False)

    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product = db.relationship('Products', back_populates='stock_transactions')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref='stock_transactions')

    def __repr__(self):
        return f'<StockTransaction {self.transaction_type}, qty {self.quantity}, product_id {self.product_id}>'

    @validates('transaction_type', 'quantity', 'date')
    def validate_transaction_type(self, key, value):
        if key == 'transaction_type' and value not in ('in', 'out'):
            raise ValueError("transaction_type must be 'in' or 'out'")
        if key == 'quantity' and value <= 0:
            raise ValueError('Quantity must be a positive integer')
        if key == 'date':
            if isinstance(value, datetime):
                return value
            if isinstance(value, str):
                try:
                    return datetime.strptime(value, '%Y-%m-%d')
                except ValueError:
                    pass
            raise ValueError(
                "Date format invalid. Use 'YYYY-MM-DD'. Example: '2026-04-20'"
            )
        return value
