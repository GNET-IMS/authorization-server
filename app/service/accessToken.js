module.exports = app => {
  const table = 'oauth_access_token';
  const { errorCode } = app.config;
  class AccessTokenService extends app.Service {
    async create (accessToken) {
      const { helper } = this.ctx;
      accessToken.value = helper.decodeToken(accessToken.value);
      const date = helper.currentTime;
      const result = app.mysql.insert(table, Object.assign({
        create_date: date,
        modify_date: date,
      }, accessToken));
    }
    async removeExpired (expiration) {
      await app.mysql.query(`delete from ${table} where expiration < ?`, [expiration])
    }
    async findByToken (token) {
      const { helper } = this.ctx;
      helper.verifyToken(token);
      const value = helper.decodeToken(token);
      const accessToken = await app.mysql.get(table, { value });
      if (!accessToken) {
        this.ctx.throw('404', errorCode['2001']);
      }
      return accessToken;
    }
  }
  return AccessTokenService;
}
