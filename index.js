var minimist = require('minimist')
var cliclopts = require('cliclopts')
var debug = require('debug')('subcommand')

module.exports = function subcommand (commands, options) {
  if (!options) options = {}
  // return value false means it was not handled
  // return value true means it was
  return function matcher (args) {
    var argv = minimist(args, options.minimistOpts)
    debug('parsed', argv)
    var sub = findCommand(argv._, commands)
    // var help = argv.help || argv.h || argv['?']
    if (!sub) return false
    var subOpts = {}
    if (sub.command.options) subOpts = cliclopts(sub.command.options).options()
    var subargv = minimist(sub.args, subOpts)
    process.nextTick(function doCb () {
      sub.command.command(subargv)
    })
    return true
  }
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
