var minimist = require('minimist')
var cliclopts = require('cliclopts')

module.exports = function subcommand (commands, options) {
  if (!options) options = {}
  if (!options.argv) options.argv = process.argv.slice(2)
  
  var argv = minimist(options.argv, options.minimistOpts)
  var sub = argv._[0]
  if (!sub) {
    var clopts = cliclopts(list(commands))
    console.log('Usage\n' + clopts.usage())
  } else {
    console.log('sub', sub)
  }
}

function list (commands) {
  return commands.map(function each (command) {
    return {
      helpIndex: command.name,
      help: command.help
    }
  })
}
