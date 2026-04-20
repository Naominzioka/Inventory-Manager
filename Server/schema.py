from marshmallow import Schema, fields, validates_schema, ValidationError

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username= fields.Str(required=True)
    email = fields.Email()

    
    @validates_schema
    def validate(self, data, **kwargs):
        if data.get('username') and len(data['username']) > 15:
            raise ValidationError('Username should not exceed 15 characters')
        