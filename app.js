module.exports = app => {
  require('./app/lib/strategy')(app);
  require('./app/lib/oauthServer')(app);
}
