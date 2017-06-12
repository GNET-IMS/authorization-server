module.exports = {
  //code
  '0001': 'Code does not exist',
  '0002': 'Code clientId does not match client id given',
  '0003': 'Code redirectURI does not match redirectURI given',

  //client
  '1001': 'Client does not exist',
  '1002': 'Client secret does not match',

  //access_token
  '2001': 'Access token does not exist',

  //refresh_token

  //oauth
  '4001': response_type => `Unsupported response type: ${response_type}, except code`,
  '4002': grantType => `Unsupported grant type: ${grantType}, except authorization_code`,

  //user
  '5001': 'User does not exist',
  '5002': 'Password is not correct'
}
