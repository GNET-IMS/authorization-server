module.exports = app => {
  const table = 'oauth_code';
  const { errorCode } = app.config;
  class CodeService extends app.Service {
    async create (code) {
      code.value = this.ctx.helper.decodeToken(code.value);
      const date = this.ctx.helper.currentTime;
      const result = await app.mysql.insert(table, Object.assign({
        create_date: date,
        modify_date: date,
      }, code))
      return result.affectedRows === 1;
    }
    async deleteByValue (value) {
      const result = await app.mysql.delete(table, { value });
      return result.affectedRows === 1;
    }
    async findByValue (value) {
      return await app.mysql.get(table, { value });
    }
    async findOneAndRemoveByToken (token) {
      const value = this.ctx.helper.decodeToken(token);
      const code = await this.findByValue(value);
      if (!code) this.ctx.throw(404, errorCode['0001']);
      await this.deleteByValue(value);
      return code;
    }
    async validate (code, authCode, client, redirect_uri) {
      const { ctx } = this;
      ctx.helper.verifyToken(code);
      if (client.client_id !== authCode.client_id) {
        ctx.throw(errorCode['0002']);
      }
      if (redirect_uri !== authCode.redirect_uri) {
        ctx.throw(errorCode['0003']);
      }
    }
  }
  return CodeService;
}
