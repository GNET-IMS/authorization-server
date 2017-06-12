const BearerStrategy = require('passport-http-bearer').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { BasicStrategy } = require('passport-http');
const { Strategy: ClientPasswordStrategy } = require('passport-oauth2-client-password');

module.exports = app => {
  app.passport.use(new LocalStrategy({
    passReqToCallback: true
  }, async(req, username, password, done) => {
    const { ctx } = req;
    const { service } = ctx;
    try {
      const user = await service.user.findByUserName(username);
      service.user.exists(user);
      service.user.verifyPassword(user.password, password);
      done(null, user);
    } catch (e) {
      done(error, false);
    }
  }));


  app.passport.use(new BearerStrategy({
    passReqToCallback: true
  }, async(req, token, done) => {
    await req.ctx.service.accessToken.findByToken(token);
    done(null, {});
  }));

  app.passport.use(new BasicStrategy({
    passReqToCallback: true
  }, async(req, clientId, clientSecret, done) => {
    const { ctx } = req;
    const { service } = ctx;
    try {
      const client = await service.client.findByClientId(clientId);
      await service.client.validate(client, clientSecret);
      done(null, client)
    } catch (e) {
      done(e, false)
    }
  }));

  app.passport.use(new ClientPasswordStrategy({
    passReqToCallback: true
  }, async(req, clientId, clientSecret, done) => {
    const { ctx } = req;
    const { service } = ctx;
    try {
      const client = await service.client.findByClientId(clientId);
      await service.client.validate(client, clientSecret);
      done(null, clinet)
    } catch (e) {
      done(e, false)
    }
  }));
}
