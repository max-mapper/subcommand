var minimist = require('minimist')
var cliclopts = require('cliclopts')
var xtend = require('xtend')
var debug = require('debug')('subcommand')

module.exports = function subcommand (commands, options) {
  if (!options) options = {}
  // return value false means it was not handled
  // return value true means it was
  return function matcher (args) {
    var toplevel = toplevelCommand(commands)
    if (toplevel && toplevel.options) var toplevelOpts = cliclopts(toplevel.options).options()
    var parseOpts = xtend({}, options.minimistOpts || {}, toplevelOpts)
    var argv = minimist(args, parseOpts)
    debug('parsed', argv)
    var sub = findCommand(argv._, commands)
    if (!sub) {
      if (argv._.length === 0 && toplevel && toplevel.command) {
        toplevel.command(argv)
        return true
      }
      return false
    }
    var subOpts = {}
    if (sub.command.options) subOpts = cliclopts(sub.command.options).options()
    var subargv = minimist(sub.args, subOpts)
    process.nextTick(function doCb () {
      sub.command.command(subargv)
    })
    return true
  }
}

// gets the command without a 'name'. there should only be one
function toplevelCommand (commands) {
  var command
  commands.map(function each (cmd) {
    if (typeof cmd.name !== 'undefined' && cmd.name === '') {
      if (command) console.error('Warning: found multiple nameless commands')
      command = cmd
    }
  })
  return command
}

function findCommand (args, commands) {
  var match, subArgs

  commands
    .map(function each (c, idx) {
      // turn e.g. 'foo bar' into ['foo', 'bar']
      return {name: c.name.split(' '), index: idx}
    })
    .sort(function each (a, b) {
      return a.name.length > b.name.length
    })
    .forEach(function eachCommand (c) {
      var cmdString = JSON.stringify(c.name)
      var argString = JSON.stringify(args.slice(0, c.name.length))
      debug('checking', cmdString, argString)
      if (cmdString === argString) {
        subArgs = args.slice(c.name.length, args.length)
        match = commands[c.index]
      }
    })

  var returnData = {command: match, args: subArgs}
  debug('match', match)
  if (match) return returnData
  else return false
}
