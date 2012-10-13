var bot
  , controller = {}

// TODO: Machine Learning With This.
//       I mean, use a database.
var spanish_help = 'OpenVE es una comunidad libre dedicada a la investigación y el desarrollo de proyectos de computación de código abierto.\n'
                 + 'Puedes Leer más información aquí: http://openve.github.com/ \n'
                 + '¡Inscríbete en nuestro foro de discusión! https://groups.google.com/forum/#!forum/openve'
  , english_help = 'OpenVE is a free community dedicated to the investigation and development of open source projects.\n'
                 + 'You can read more here: http://openve.github.com/ \n'
                 + 'Get involved in our forum! https://groups.google.com/forum/#!forum/openve'
  , known_messages = {
      'I LOVE YOU!' : 'I love you too!'
    , 'O/' : '\\o'
    , 'HOLA!' : 'Hola :D'
    , 'HOLA'  : 'Hola :P'
    , 'HELLO!': 'Hello :D'
    , 'HELLO' : 'Hello :P'
    , 'AYUDA' : spanish_help
    , 'AYUDA!': spanish_help
    , 'HELP'  : english_help
    , 'HELP!' : english_help
    , '?'     : '???'
    }
  , twitter_search = {}
  , irc_nick_uppercased
  , irc_nick_regex

exports.init = function(_bot) {
  bot = _bot
  irc_nick_uppercased = bot.config.irc.nick.toUpperCase()
  irc_nick_regex = new RegExp('.?' + irc_nick_uppercased + '.?', 'g')
  return controller
}

// Say hello to new users
controller.join = function(channel, nick) {
  nick = nick.toUpperCase()
  if (nick === irc_nick_uppercased) {
    bot.client.say(channel, '¡Saludos!')
  } else {
    bot.client.say(channel, nick + ': ' + '¡Bienvenido a OpenVE! :)')
  }
}

// Answering to user's messages
controller.message = function(from, to, message) {
  message = message.toUpperCase()
  if (to === '#openve' && ~message.indexOf(irc_nick_uppercased)) {
    message = message.replace(irc_nick_regex, '').trim()
    if (message === '???') {
      // Avoiding recursion when there are two bots in the room.
      return
    } else
    if (known_messages[message]) {
      bot.client.say(to, from + ': ' + known_messages[message])
    } else {
      bot.client.say(to, from + ': ' + known_messages['?'])
    }
  }
}

controller.twitterSearch = function(obj) {
  var results = obj.results
    , host = 'https://twitter.com/'
    , url
    , k
    , v
  if (!twitter_search.updated_at) {
    twitter_search.updated_at = new Date(results[0].created_at)
  }
  for (k in results) {
    v = results[k]
    if (!twitter_search[v.id_str]) {
      twitter_search[v.id_str] = v
      if (twitter_search.started
      && (twitter_search.updated_at - new Date(v.created_at)) < 0 // New tweet
        ) {
        url = host + v.from_user + '/status/' + v.id_str
        bot.client.say('#OpenVE', 'Twitter: "' + v.text + '"\n' + url)
      }
    }
  }
  twitter_search.started = true
}
