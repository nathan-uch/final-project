const jwt = require('jsonwebtoken');
const ClientError = require('../server/client-error');

function AuthorizationMiddleware(req, res, next) {
  const xAccessToken = req.get('X-Access-Token');
  if (!xAccessToken) throw new ClientError(401, 'Authentication required');
  const verifiedToken = jwt.verify(xAccessToken, process.env.TOKEN_SECRET);
  req.user = verifiedToken;
  next();
}

module.exports = AuthorizationMiddleware;
