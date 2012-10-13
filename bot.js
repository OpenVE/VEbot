var http = require('http')
  , bot = {
    config : require('./config')
  }

bot.controller = require('./controller').init(bot)

bot.client = require('./irc').init(bot)

bot.twitter_interval = require('./twitter').init(bot)

bot.github_interval = require('./github').init(bot)

// Server
http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type' : 'text/plain'})
  res.end('VEbot for OpenVE')
}).listen(process.env.PORT || 3000)
