// bot.js
//
// VEbot: OpenVE's IRC Bot
//
// By: Daniel Rodríguez <http://sadasant.com/>
// Date: 10-10-2012
// License: GNU GPL 3.0
//

// Dependencies
var irc     = require('irc')
  , http    = require('http')
  , secrets = require('./secrets')

// Client
var client  = new irc.Client('irc.freenode.net', 'VEbot', {
      channels : ['#OpenVE']
    , password : secrets.password
    })

// Machine Learning With This.
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
    , 'HOLA'  : 'Hola :O'
    , 'HELLO!': 'Hello :D'
    , 'HELLO' : 'Hello :O'
    , 'AYUDA' : spanish_help
    , 'AYUDA!': spanish_help
    , 'HELP'  : english_help
    , 'HELP!' : english_help
    }

// API answers
var APIs = {
  twitter : {} // By id
, github  : {} // By date // TODO
}

// Once we're connected, we should authentify
client.addListener('join', function(channel, nick) {
  if (nick === 'VEbot') {
    client.say(channel, '¡Saludos!')
  } else {
    client.say(channel, nick + ': ' + '¡Bienvenido a OpenVE! :)')
  }
})

// Answering to user's messages
client.addListener('message', function(from, to, message) {
  if (to === '#openve' && ~message.indexOf('VEbot:')) {
    message = message.replace('VEbot:', '').toUpperCase().trim()
    if (known_messages[message]) {
      client.say(to, from + ': ' + known_messages[message])
    }
  }
})

setInterval(function() {
  http.get('http://search.twitter.com/search.json?q=OpenVE&rpp=5&result_type=recent', gotTwitterResults)
}, 1000 * 30 * 1) // 30 segs

function gotTwitterResults(res) {
  var data = ''
  res.on('data', function(chunk) {
    data += chunk
  })
  res.on('end', function() {
    var obj = JSON.parse(data)
      , results = obj.results
      , k
    for (k in results) {
      // console.log(APIs.twitter[results[k].id_str])
      if (!APIs.twitter[results[k].id_str]) {
        APIs.twitter[results[k].id_str] = results[k]
        if (APIs.twitter.started) {
          client.say('#OpenVE', 'Twitter: "' + results[k].text + '"')
        }
      }
    }
    APIs.twitter.started = true
  })
}

// Server
http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type' : 'text/plain'})
  res.end('VEbot for OpenVE')
}).listen(process.env.PORT || 3000)
