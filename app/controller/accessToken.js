'use strict';

module.exports = app => {
  class AccessTokenController extends app.Controller {
    async show() {
      const { ctx } = this;
      const { id } = ctx.params;
      const accessToken = await ctx.service.accessToken.findByToken(id);
      ctx.body = {
          access_token: accessToken
      }
      ctx.status = 200;
    }
  }
  return AccessTokenController;
};
