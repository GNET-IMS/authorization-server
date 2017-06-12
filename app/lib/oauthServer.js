const oauth2orize = require('oauth2orize');

module.exports = app => {
  // create OAuth 2.0 server
  const server = oauth2orize.createServer();
  /**
   * Grant authorization codes
   *
   * The callback takes the `client` requesting authorization, the `redirectURI`
   * (which is used as a verifier in the subsequent exchange), the authenticated
   * `user` granting access, and their response, which contains approved scope,
   * duration, etc. as parsed by the application.  The application issues a code,
   * which is bound to these values, and will be exchanged for an access token.
   */
  server.grant(oauth2orize.grant.code((client, redirectURI, user, ares, done) => {
    const code = utils.createToken({
      sub: user.id,
      exp: config.codeToken.expiresIn
    });
    db.authorizationCodes.save(code, client.id, redirectURI, user.id, client.scope)
      .then(() => done(null, code))
      .catch(err => done(err));
  }));

  /**
   * Grant implicit authorization.
   *
   * The callback takes the `client` requesting authorization, the authenticated
   * `user` granting access, and their response, which contains approved scope,
   * duration, etc. as parsed by the application.  The application issues a token,
   * which is bound to these values.
   */
  server.grant(oauth2orize.grant.token((client, user, ares, done) => {
    const token = utils.createToken({
      sub: user.id,
      exp: config.token.expiresIn
    });
    const expiration = config.token.calculateExpirationDate();
    db.accessTokens.save(token, expiration, user.id, client.id, client.scope)
      .then(() => done(null, token, expiresIn))
      .catch(err => done(err));
  }));

  /**
   * Exchange authorization codes for access tokens.
   *
   * The callback accepts the `client`, which is exchanging `code` and any
   * `redirectURI` from the authorization request for verification.  If these values
   * are validated, the application issues an access token on behalf of the user who
   * authorized the code.
   */
  server.exchange(oauth2orize.exchange.code((client, code, redirectURI, done) => {
    db.authorizationCodes.delete(code)
      .then(authCode => validate.authCode(code, authCode, client, redirectURI))
      .then(authCode => validate.generateTokens(authCode))
      .then((tokens) => {
        if (tokens.length === 1) {
          return done(null, tokens[0], null, expiresIn);
        }
        if (tokens.length === 2) {
          return done(null, tokens[0], tokens[1], expiresIn);
        }
        throw new Error('Error exchanging auth code for tokens');
      })
      .catch(() => done(null, false));
  }));

  /**
   * Exchange user id and password for access tokens.
   *
   * The callback accepts the `client`, which is exchanging the user's name and password
   * from the token request for verification. If these values are validated, the
   * application issues an access token on behalf of the user who authorized the code.
   */
  server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
    db.users.findByUsername(username)
      .then(user => user.verifyPasswordPromise(user, password))
      .then(user => validate.generateTokens({
        scope,
        userID: user.id,
        clientID: client.id
      }))
      .then((tokens) => {
        if (tokens === false) {
          return done(null, false);
        }
        if (tokens.length === 1) {
          return done(null, tokens[0], null, expiresIn);
        }
        if (tokens.length === 2) {
          return done(null, tokens[0], tokens[1], expiresIn);
        }
        throw new Error('Error exchanging password for tokens');
      })
      .catch(() => done(null, false));
  }));

  /**
   * Exchange the client id and password/secret for an access token.
   *
   * The callback accepts the `client`, which is exchanging the client's id and
   * password/secret from the token request for verification. If these values are validated, the
   * application issues an access token on behalf of the client who authorized the code.
   */
  server.exchange(oauth2orize.exchange.clientCredentials((client, scope, done) => {
    const token = utils.createToken({
      sub: client.id,
      exp: config.token.expiresIn
    });
    const expiration = config.token.calculateExpirationDate();
    // Pass in a null for user id since there is no user when using this grant type
    db.accessTokens.save(token, expiration, null, client.id, scope)
      .then(() => done(null, token, null, expiresIn))
      .catch(err => done(err));
  }));

  /**
   * Exchange the refresh token for an access token.
   *
   * The callback accepts the `client`, which is exchanging the client's id from the token
   * request for verification.  If this value is validated, the application issues an access
   * token on behalf of the client who authorized the code
   */
  server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
    db.refreshTokens.find(refreshToken)
      .then(foundRefreshToken => validate.refreshToken(foundRefreshToken, refreshToken, client))
      .then(foundRefreshToken => validate.generateToken(foundRefreshToken))
      .then(token => done(null, token, null, expiresIn))
      .catch(() => done(null, false));
  }));

  app.oauthServer = server;
}
