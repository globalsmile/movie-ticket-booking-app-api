// src/middleware/validate.js
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status_code: 400,
        message: error.details[0].message,
        data: {}
      });
    }
    next();
  };
  
  module.exports = validate;
  