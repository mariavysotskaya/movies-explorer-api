const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: 'Превышен лимит в 100 запросов в течение 24 часов!',
  standardHeaders: true,
  legacyHeaders: false,
});
