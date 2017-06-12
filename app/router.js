'use strict';

module.exports = app => {
  const ensureLoggedIn = app.middlewares.ensureLoggedIn();
  const authorizeDecision = app.middlewares.authorizeDecision(app);

  app.get('/', ensureLoggedIn, 'login.home');
  app.get('/login', 'login.index');
  app.post('/login', app.passport.authenticate('local'), 'login.login');
  app.get('/logout', 'login.logout');

  app.get('/login/oauth/authorize', ensureLoggedIn, 'oauth.index');
  app.post('/login/oauth/authorize', ensureLoggedIn, 'oauth.authorize');
  app.post('/login/oauth/token', app.passport.authenticate('basic'), 'oauth.token');

  app.resources('access_token', '/api/access_token', 'accessToken');
  app.get('/api/user',  app.passport.authenticate('bearer'), 'user.getByAccessToken');
};
