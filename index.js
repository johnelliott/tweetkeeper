var Twit = require('twit')
var T = new Twit(require('./keys.js'))
var dbPool = require('./psql-db.js')

module.exports = getTweets
getTweets(process.argv[2] || 'sensanders')

// Store 15 tweets to db for a user
function getTweets(handle) {
T.get('statuses/user_timeline', {screen_name: handle, count: 15})
  .then(function(result) {

    //console.log('result keys', Object.keys(result))
    //console.log('result resp', result.resp.read)
    //result.resp.pipe(process.stdout)
    //console.log('result data', result.data)

    console.log('pluck', pluck(result.data))
    var plucked = pluck(result.data)
    plucked.forEach(row=>{
      var {time, text, handle} = row
      console.log(time, text, handle)
      dbPool.query('INSERT INTO tweets (handle, time, text) values ($1, $2, $3)', [handle, time, text], function(err) {
        if (err) throw err
      })
    })
  })
}

/**
 * Translate js to psql date format
 *
 * this is so fragile and temporary.....
 *
 * new date -> 2001-09-28 01:00:00
 */
function makePsqlTimestamp(date) {
  return date.getUTCFullYear()
    + '-'
    + date.getUTCMonth()
    + '-'
    + date.getUTCDay()
    + ' '
    + date.getUTCHours()
    + ':'
    + date.getUTCMinutes()
    + ':'
    + date.getUTCSeconds()
}

/**
 * Extract certain tweet data
 * array -> array
 */
function pluck(data) {
   return data.map(tw=>{
      return {
        handle: tw.user.screen_name,
        time: makePsqlTimestamp(new Date(tw.created_at)),
        text: tw.text
      }
    })
}
