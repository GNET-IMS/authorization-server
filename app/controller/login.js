'use strict';

module.exports = app => {
  class LoginController extends app.Controller {
    async home() {
      this.ctx.body = {
        user: this.ctx.user,
        isAuthenticated: this.ctx.isAuthenticated()
      }
    }
    async index() {
      await this.ctx.render('login.ejs');
    }
    async login() {
      const { ctx } = this;
      // const { service } = ctx;
      // const { username, password } = ctx.request.body;

      // try {
      //   const user = await service.user.findByUserName(username);
      //   service.user.exists(user);
      //   service.user.verifyPassword(user.password, password);
      // } catch (e) {
      //   await ctx.redirect('/login');
      //   throw e;
      // }
      // ctx.redirect(`/login/oauth/authorize?redirect_uri=http://www.baidu.com&response_type=code&client_id=admin`);
      if (ctx.session.redirectTo) {
        ctx.redirect(ctx.session.redirectTo);
      } else {
        ctx.redirect('/');
      }
      
    }
    async logout() {

    }
  }
  return LoginController;
};
