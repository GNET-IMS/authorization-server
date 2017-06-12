const bcrypt = require('bcrypt-nodejs');
const uuid = require('uuid/v4');
const moment = require('moment');

module.exports = {
  get currentTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  },
  hashEncodeSync(password, rounds = 5) {
    const salt = bcrypt.genSaltSync(rounds);
    return bcrypt.hashSync(password, salt);
  },
  hashDecodeSnyc(data, hash) {
    return bcrypt.compareSync(data, hash);
  },
  createToken(exp = 3600, sub = '') {
    const { privateKey } = this.app.config;
    return this.app.jwt.sign({
      jti : uuid(),
      sub,
      exp : Math.floor(Date.now() / 1000) + exp,
    }, privateKey, {
      algorithm: 'RS256',
    })
  },
  decodeToken(token) {
    return this.app.jwt.decode(token).jti;
  },
  verifyToken(token) {
    const { publicKey } = this.app.config;
    this.app.jwt.verify(token, publicKey);
  },

}
