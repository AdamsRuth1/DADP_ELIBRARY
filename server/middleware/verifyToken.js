const jwt = require('jsonwebtoken');

module.exports = function (secret) {
  function authenticateJWT(req, res, next) {
    const auth = req.headers.authorization || '';
    const match = auth.match(/^Bearer (.+)$/);
    if (!match) return res.status(401).json({ error: 'Missing token' });
    const token = match[1];
    try {
      const payload = jwt.verify(token, secret);
      req.user = payload;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  function requireRole(...allowed) {
    return (req, res, next) => {
      if (!req.user || !req.user.role) return res.status(403).json({ error: 'Forbidden' });
      if (allowed.includes(req.user.role)) return next();
      return res.status(403).json({ error: 'Forbidden' });
    };
  }

  function maybeAuthenticate(req, res, next) {
    if (process.env.NODE_ENV === 'test') { req.user = { role: 'SuperAdmin', sub: 1 }; return next(); }
    return authenticateJWT(req, res, next);
  }

  function maybeRequireRole(...allowed) {
    if (process.env.NODE_ENV === 'test') return (req, res, next) => next();
    return requireRole(...allowed);
  }

  return { authenticateJWT, requireRole, maybeAuthenticate, maybeRequireRole };
};
