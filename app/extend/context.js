
const BAR = Symbol('Context#bar');
module.exports = {
  get access_token() {
    const headers = this.headers;
    const authorization = headers.authorization;
    return authorization && authorization.split(' ').length > 1 && authorization.split(' ')[1];
  },
};