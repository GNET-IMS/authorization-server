
module.exports = app => {
  const { errorCode } = app.config;
  class OauthService extends app.Service {
    async generateAccessToken ({ user_id, client_id, scope }) {
      const { ctx } = this;
      const { oauth } = app.config;
      const token = ctx.helper.createToken(oauth.access_token.expires_in, user_id);
      const expiration = Date.now() + oauth.access_token.expires_in * 1000;
      await ctx.service.accessToken.create({
        value: token,
        expiration,
        user_id,
        client_id,
        scope
      })
      return token
    }
    async generateRefreshToken ({ user_id, client_id, scope }) {
      const { ctx } = this;
      const { oauth } = app.config;
      const token = ctx.helper.createToken(oauth.refresh_token.expires_in, user_id);
      await ctx.service.refreshToken.create({
        value: token,
        user_id,
        client_id,
        scope
      })
      return token;
    }
    async generateTokens (code) {
      if (this.isRefreshToken(code)) {
        return await Promise.all([
          this.generateAccessToken(code),
          this.generateRefreshToken(code)
        ])
      }
      return await this.generateToken(code);
    }
    async isRefreshToken ({ scope }) {
      return scope != null && scope.indexOf('offline_access') === 0;
    }
    async validate(query) {
      const { scope, response_type, client_id } = query;
      const { ctx } = this;
      if (response_type !== 'code') {
        ctx.throw(501, errorCode['4001'](response_type));
      }
      const client = await ctx.service.client.findByClientId(client_id);
      client.scope = scope;
      return client;
    }
    validateGrantType (grantType) {
      const { ctx } = this;
      if (grantType !== 'authorization_code') {
        ctx.throw(501, errorCode['4002'](grantType));
      }
    }
    async removeExpiredTokens() {
      const { service } = this.ctx;
      const expiration = Date.now();
      await Promise.all([
        service.accessToken.removeExpired(expiration)
        // service.code.removeExpired(expiration),
        // service.refreshToken.removeExpired(expiration)
      ])
    }
  }
  return OauthService;
}
