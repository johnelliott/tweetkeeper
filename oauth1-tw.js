var url = require('url')
var http = require('http')
var OAuth2 = require('oauth').OAuth2
var keys = require('./keys.js') // Fill in your creds from twitter there

var oauth = new OAuth(
	'https://api.twitter.com/oauth/request_token',
	'https://api.twitter.com/oauth/access_token',
	keys.consumer_key,
	keys.consumer_secret,
	'1.0A',
	process.env.CALLBACKURL || null,
	'HMAC-SHA1'
)

/**
 * set up a server to deal with oauth
 */
var server = http.createServer(function (req, res) {
	oauth.getOAuthRequestToken(function(err, oAuthToken, oAuthTokenSecret, results) {

		/**
		 * set up oauth handlers
		 */
		function oAuthHandler (req, res) {
			/**
			 * Creating an anchor with authURL as href and sending as response
			 */
			var body = `<a href="https://twitter.com/oauth/authenticate?ouath_token=${oAuthToken}"> Get Code </a>`
			res.writeHead(200, {
				'Content-Length': body.length,
				'Content-Type': 'text/html' })
			res.end(body)
		}

		function oAuthHandlerCallback (req, res) {
			// get access token
			oauth.getOAuthAccessToken(
				urlObj.query.oauth_token,
				oAuthTokenSecret,
				urlObj.query.oauth_verifier,
				getOauthRequestTokenCallback
			)
		}

		// set up callback for after we get access token
		function getOauthRequestTokenCallback(err, oAuthAccessToken, oAuthAccessTokenSecret, results) {
			if (err) {
				console.err('there was an eeor')
				throw err
			}

			oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json',
				oAuthAccessToken,
				oAuthAccessTokenSecret,
				function (err, twitterResponseData, result) {
					if (err) throw err
					try { console.log(JSON.parse(twitterResponseData));
					} catch (parseError) {
						console.log(parseError);
					}
					console.log(twitterResponseData);
					res.end(twitterResponseData)
				})
		}

		// set up handlers for oauth endpoints
		var handlers = {
			'/': oAuthHandler,
			'/callback': oAuthHandlerCallback
		}
		// Use the handlers we've set up depending on route
		var urlObj = url.parse(req.url, true)
		handlers[urlObj.pathname](req, res)
	})
}).listen(3000)
console.log('server listening http://localhost:3000 cburl:' + process.env.CALLBACKURL)
