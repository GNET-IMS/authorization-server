'use strict';
const path = require('path');
const fs = require('fs');
const errorCode = require('../app/lib/errorCode');

const privateKey = fs.readFileSync(path.join(__dirname, '../certs/privatekey.pem'));
const publicKey = fs.readFileSync(path.join(__dirname, '../certs/certificate.pem'));


module.exports = appInfo => {
  return {
    // should change to your own
    keys: appInfo.name + '_1495437563201_3403',

    middleware: ['errorHandler'],

    // 只对 /api 前缀的 url 路径生效
    errorHandler: {
      match: '/',
    },

    errorCode,

    view: {
      mapping: {
        '.ejs': 'ejs',
      },
    },
    // ejs config
    ejs: {},

    privateKey,

    publicKey,

    oauth: {
      code: {
        expires_in: 3600
      },
      access_token: {
        expires_in: 3600
      },
      refresh_token: {
        expires_in: 3600 * 24
      },
      client: {
        id: 'admin',
        secret: '1234',
      },
    },

    mysql: {
      // database configuration
      client: {
        // host
        host: 'localhost',
        // port
        port: '3306',
        // username
        user: 'root',
        // password
        password: '728198454',
        // database
        database: 'IMS',
      },
      // load into app, default is open
      app: true,
      // load into agent, default is close
      agent: false,
    },

    security: {
      csrf: false
    },

    jwt: {
      secret: '123456'
    },
  };
};
