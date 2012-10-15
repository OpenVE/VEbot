var http = require('http')
  , xml   = require('xml2json')
  , bot
  , options = {
      host : ''
    , path : ''
    , method : 'GET'
    }
  , time = 1000 * 60 * 1 // 1 Minute

exports.init = function(_bot) {
  bot = _bot

  options.host = bot.config.github.host
  options.path = bot.config.github.path

  makeRequests()
}

function makeRequests() {
  var req = http.request(options, gotResults)
  req.end()
  req.on('error', gotError)
}

function gotResults(res) {
  var data = ''
  res.on('data', function(chunk) {
    data += chunk
  })
  res.on('end', function() {
    try {
      data = JSON.parse(xml.toJson(data))
    } catch(e) {
      return gotError(e)
    }
    bot.controller.githubFeed(data)
    setTimeout(makeRequests, time)
  })
}

function gotError(error) {
  console.log(error)
  setTimeout(makeRequests, time)
}
