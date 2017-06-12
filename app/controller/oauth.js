'use strict';

module.exports = app => {
  class OauthController extends app.Controller {
    async index() {
      const { ctx } = this;
      const { redirect_uri, scope, client_id } = ctx.query;
      const client = await ctx.service.oauth.validate(ctx.query);
      ctx.session.oauth = {
        client_id,
        redirect_uri,
        scope,
      }
      await this.ctx.render('authorize.ejs', {
        user: this.ctx.user,
        client,
        redirect_uri,
      });
    }
    async authorize() {
      const { ctx } = this;
      const { isAuthorized } = ctx.request.body;
      const { scope, client_id, state } = ctx.query;
      const user = ctx.user;
      const { oauth } = app.config;
      const { client } = oauth;
      const oauthSession = ctx.session.oauth;
      if (isAuthorized === 'true') {
        const token = ctx.helper.createToken(oauth.code.expires_in, user.id);
        const code = await ctx.service.code.create({
          value: token,
          client_id: oauthSession.client_id,
          redirect_uri: oauthSession.redirect_uri,
          user_id: user.id,
          scope: oauthSession.scope
        });
        ctx.redirect(`${oauthSession.redirect_uri}?code=${token}${state ? `&state=${state}` : ''}`);
      } else {
        ctx.redirect('/login');
      }
    }
    async token() {
      const { ctx } = this;
      const { service } = ctx;
      const { code, scope, redirect_uri, client_id, client_secret, grant_type } = ctx.request.body
      const client = await service.client.findByClientId(client_id);
      service.oauth.validateGrantType(grant_type);
      const authCode = await service.code.findOneAndRemoveByToken(code);
      await service.code.validate(code, authCode, client, redirect_uri);
      const tokens = await service.oauth.generateTokens(authCode);
      let access_token, refresh_token, expires_in;
      if (Array.isArray(tokens)) {
        access_token = tokens[0];
        refresh_token = tokens[1];
      } else {
        access_token = tokens;
      }
      expires_in = app.config.oauth.access_token.expires_in;
      ctx.body = {
        access_token,
        refresh_token,
        expires_in,
      }
      ctx.status = 200;
    }
  }
  return OauthController;
};
