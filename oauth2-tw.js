var url = require('url')
var OAuth2 = require('oauth').OAuth2
var Twit = require('twitter')
var keys = require('./keys.js') // Fill in your creds from twitter there

var oauth2 = new OAuth2(
	keys.consumer_key,
	keys.consumer_secret,
	'https://api.twitter.com/',
	null,
	'oauth2/token',
  null
)

var getBearer = new Promise(function (accept, reject) {
  // code, params, callback
  oauth2.getOAuthAccessToken(
    '',
    {'grant_type': 'client_credentials'},
    function(err, accessToken, refreshToken, results) {
      if (err) reject(err)
      //console.log('bearer', accessToken, refreshToken)
      console.log('results', results)
      accept({accessToken, refreshToken, results})
    }
  )
}).then(getStream) // it's not a stream because stream api doesn't work with app-only authentication

// try twitter app-only auth
function getStream (args) {
	// set up twitter api client
  var T = new Twit({
    consumer_key: '4CM3Y0ZacO0SMAyxTAJiuGmFp',
    consumer_secret: 'nJsUI2FjnpV43NFD6ETf28wbRu14Wq7N901kfsDkjyVyTi7PxS',
    bearer_token: args.results.access_token
  })
	// use REST endpoint
  T.get('search/tweets', {q: 'node.js'}, function(err, tweets, response) {
    console.error(err)
    debugger
    console.log('tweets', tweets)
    //console.log('response', response)
    //response.pipe(process.stdout)
  })
}
