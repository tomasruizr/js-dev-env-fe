export const schema = {
  "type": "object",
  "properties": {
    "user": {
      "type": "array",
      "minItems": 3,
      "maxItems": 5,
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "unique": true,
            "minimum": 1,
            "maximum": 1000
          },
          "firstName": {
            "type": "string",
            "faker": "name.firstName"
          },
          "lastName": {
            "type": "string",
            "faker": "name.lastName"
          },
          "email": {
            "type": "string",
            "format": "email",
            "faker": "internet.email"
          }
        },
        "required": ["id", "firstName", "lastName", "email"]
      }
    }
  },
  "required": ["user"]
};
