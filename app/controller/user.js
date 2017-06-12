module.exports = app => {
    class UserController extends app.Controller {
        async getByAccessToken (accessToken) {
            const { ctx } = this;
            const access_token = ctx.access_token;
            const user = await ctx.service.user.getByAccessToken(access_token);
            ctx.body = {
                user
            }
            ctx.status = 200;
        }
    }
    return UserController
}