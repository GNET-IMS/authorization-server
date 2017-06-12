module.exports = app => {
  if (Array.isArray(app.oauthServer.decision())) {
    return app.oauthServer.decision().map(item => {
      return (ctx, next) => {
        const res = ctx.res;
        const req = ctx.req;
        const end = res.end;
        console.log(res.oauth2);
        return new Promise((resolve, reject) => {
          res.end = function() {
            end.apply(this, arguments)
            resolve()
          }
          item(res, req, reject)
        }).catch(next)
      }
    })
  } else {
    return (ctx, next) => app.oauthServer.decision()(ctx.request, ctx.response, next)
  }
}
