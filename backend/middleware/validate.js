
// backend/middleware/validate.js
const { z } = require('zod');

function validator(schema, source='body') {
  return (req, res, next) => {
    const data = source === 'query' ? req.query : req.body;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.issues });
    }
    if (source === 'query') req.query = parsed.data; else req.body = parsed.data;
    next();
  };
}

module.exports = { z, validator };
