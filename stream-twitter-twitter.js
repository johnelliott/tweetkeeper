var Twit = require('twitter')
var T = new Twit({
  consumer_key: '4CM3Y0ZacO0SMAyxTAJiuGmFp',
  consumer_secret: 'nJsUI2FjnpV43NFD6ETf28wbRu14Wq7N901kfsDkjyVyTi7PxS',
  app_only_auth: true
})

//T.get('account/verify_credentials', { skip_status: false })
//  .catch(function (err) {
//    console.log('caught error', err.stack)
//  })
//  .then(function (result) {
//    // `result` is an Object with keys "data" and "resp".
//    // `data` and `resp` are the same objects as the ones passed
//    // to the callback.
//    // See https://github.com/ttezel/twit#tgetpath-params-callback
//    // for details.
//
//    //console.log('VERIFY CRED data', result.data);
//  })

debugger
var stream = T.stream('statuses/sample')
console.log('stream', stream)

stream.on('message', function (data) {
  console.log('message', data)
})

stream.on('connected', function (response) {
  console.log('connected event')
})
stream.on('connect', function (response) {
  console.log('connect event')
  //console.log('response', response)
  //console.log('response.pipe', response.pipe)
  response.pipe(process.stdout)
})

stream.on('error', function (data) {
  console.error(data)
})
