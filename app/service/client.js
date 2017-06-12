module.exports = app => {
  const table = 'oauth_client';
  const { errorCode } = app.config;
  class ClientService extends app.Service {
    async findByClientId (clientId) {
      const { ctx } = this;
      const client = await app.mysql.get(table, { client_id: clientId });
      if (!client ) ctx.throw(404, errorCode['1001']);
      return client;
    }
    async validate (client, clientSecret) {
      const { ctx } = this;
      if (!client) {
        ctx.throw(404, errorCode['1001'])
      }
      if (client.secret !== clientSecret) {
        ctx.throw(errorCode['1002'])
      }
    }
  }
  return ClientService;
}
