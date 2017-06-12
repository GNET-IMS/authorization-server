module.exports = {
    schedule: {
        interval: '1h',
        type: 'all',
    },
    async task(ctx) {
        const { service } = ctx;
        await service.oauth.removeExpiredTokens()
    },
};
