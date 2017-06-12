module.exports = app => {
  const table = 'sys_user';
  const { errorCode } = app.config;
  class UserService extends app.Service {
    async findByUserName(username) {
      return await app.mysql.get(table, { username });
    }
    exists(user) {
      if (user == null) {
        this.ctx.throw(404, errorCode['5001']);
      }
    }
    verifyPassword(password, loginPassword) {
      if (!this.ctx.helper.hashDecodeSnyc(loginPassword, password)) {
        this.ctx.throw(errorCode['5002']);
      }
    }
    async getByAccessToken (accessToken) {
      this.ctx.helper.verifyToken(accessToken);
      const value = this.ctx.helper.decodeToken(accessToken);
      const result = await app.mysql.queryOne(`
          select user.* from ${table} user
          left join oauth_access_token access_token on user.id = access_token.user_id 
          where access_token.value = ? ;
      `, [value]);
      if (!result) this.ctx.throw(404, errorCode['5001']);
      return result;
    }
  }
  return UserService;
}
