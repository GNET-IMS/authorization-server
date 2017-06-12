module.exports = () => {
  return async(ctx, next) => {
    if (ctx.isAuthenticated()) {
      await next();
    } else {
      ctx.session.redirectTo = ctx.url;
      ctx.redirect('/login');
    }
  };
};
