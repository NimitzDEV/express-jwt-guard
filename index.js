const jwt = require('jsonwebtoken');

/**
 * JWTGuard
 */
class JWTGuard {
  /**
   * Creates an instance of JWTGuard.
   * @param {Object} map Guarding router map
   * @param {String} secret JWT secret
   * @param {Object} jwtOptions Options for JWT
   * @param {Object} options Options for JWTGuard
   * @memberof JWTGuard
   */
  constructor(map, secret, jwtOptions, options) {
    this.map = { ...map };
    this.secret = secret;
    this.jwtOptions = { ...jwtOptions };
    this.options = Object.assign(
      {
        header: 'JWT',
        lang: {
          NO_TOKEN: 'No token provided!',
          INSUFFICIENT_PERMISSION: 'Insufficient permission!',
        },
      },
      options || {}
    );

    this.guard = this.guard.bind(this);
    this.issuer = this.issuer.bind(this);
    this._checkPermission = this._checkPermission.bind(this);
  }

  /**
   * Connect/Express router guard middleware
   *
   * @param {Object} req Connect/Express req object
   * @param {Object} res Connect/Express res object
   * @param {Function} next Connect/Express next callback function
   * @returns {undefined} No value will be returned
   * @memberof JWTGuard
   */
  guard(req, res, next) {
    // Use route level matched path first
    // or use app level matched path
    const matched =
      (req.route && req.baseUrl + req.route.path) ||
      req.originalUrl;
    // Check if this path should be validated
    const mapConfig = this.map[matched];
    if (!mapConfig) return next();

    // Check if current request method should be validated
    // or all request methods will be validated
    const method = req.method;
    if (mapConfig.methods && !mapConfig.methods.includes(method)) return next();

    // Decode JWT

    // Retrive token from header
    const token = req.get(this.options.header) || '';
    if (!token) {
      res.status(401).send(this.options.lang.NO_TOKEN);
      return false;
    }

    // Verify JWT token
    let data = {};
    jwt.verify(token, this.secret, this.jwtOptions, (err, result) => {
      if (err) {
        res.status(401).send(err);
        return false;
      }

      const pResult = this._checkPermission(result, mapConfig);
      if (pResult) {
        req.jwt = { ...result };
        return next();
      } else {
        res.status(403).send(this.options.lang.INSUFFICIENT_PERMISSION);
        return;
      }
    });
  }

  /**
   * Permissions cheker
   *
   * @param {Object} data JWT data
   * @param {Object} mapConfig Map config that should validate against
   * @returns {Boolean} Indicates wheather current request permission is fullfilled
   * @memberof JWTGuard
   */
  _checkPermission(data, mapConfig) {
    let fullfilled = 0;
    const permissions = data.permissions || [];

    if (permissions && mapConfig.permissions) {
      mapConfig.permissions.forEach(permission => {
        if (permissions.includes(permission)) fullfilled++;
      });
    }

    return fullfilled >= mapConfig.permissions.length;
  }

  /**
   * JWT token issuer
   *
   * @param {Object} payload JWT token payload
   * @param {Function} [callback] Callback function
   * @memberof JWTGuard
   */
  issuer(payload, callback) {
    const config = [payload, this.secret, this.jwtOptions];
    if (typeof callback === 'function') config.push(callback);
    return jwt.sign.apply(null, config);
  }
}

module.exports = function(map, secret, jwtOptions, options) {
  return new JWTGuard(map, secret, jwtOptions, options);
};
