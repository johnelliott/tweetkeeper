var Twit = require('twit')
var T = new Twit(require('./keys.js'))

var sdkAction = T.get('statuses/user_timeline', { screen_name:'hillaryclinton', count: 1}, function(err, data, response) {
  console.log(data)
})
