var Twit = require('twit')
var T = new Twit(require('./keys.js'))

  /*
var sdkAction = T.get('statuses/user_timeline', { screen_name:'hillaryclinton', count: 1}, function(err, data, response) {
  //TODO make this real streaming by dipping into twit somehow
  //process.stdout.write(new Buffer(JSON.stringify(data)))
  //response.request.pipe(process.stdout)
})
*/

var sdkAction = T.get('statuses/user_timeline', { screen_name:'hillaryclinton', count: 1}, 'pipe')
