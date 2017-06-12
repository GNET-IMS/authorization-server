module.exports = app => {
  const table = 'oauth_refresh_token';
  class RefreshTokenService extends app.Service {
    async create (refreshToken) {
      const { helper } = this.ctx;
      refreshToken.value = helper.decodeToken(refreshToken.value);
      const date = helper.currentTime;
      const result = app.mysql.insert(table, Object.assign({
        create_date: date,
        modify_date: date,
      }, refreshToken));
    }
  }
  return RefreshTokenService;
}
