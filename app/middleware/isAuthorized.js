module.exports = () => {
    return function (ctx) {
        const { app } = ctx;
        return app.passport.authenticate('local', {
             successReturnToOrRedirect: '/',
             failureRedirect: '/login'
        });
    };
};
