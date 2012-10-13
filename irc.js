var irc = require('irc')

exports.init = function(bot) {
  var client = new irc.Client(bot.config.irc.server, bot.config.irc.nick, {
    channels : bot.config.irc.channels
  , password : bot.config.irc.password
  })

  // Say hello to the new users
  client.addListener('join', bot.controller.join)

  // Answering to user's messages
  client.addListener('message', bot.controller.message)

  setInterval(function() {
    client.whois(bot.config.irc.nick)
  }, 1000 * 60 * 1) // One Minute

  return client
}

