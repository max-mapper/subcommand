var minimist = require('minimist')
//  var cliclopts = require('cliclopts')
//  var xtend = require('xtend')
var debug = require('debug')('subcommand')

function match(config, options, args, cmd) {
    var argv = minimist(args)

    var moreCmds = false
    if (argv._.length > 0 && config.commands) {
        moreCmds = config.commands.filter(function(_cmd) { return _cmd.name == argv._[0]}).length > 0
    }

    if (cmd && cmd == config.name && !moreCmds) {
        config.command(argv)
        return true
    } 

    var nextCmd = argv._.shift()
    var nextArgs = args.filter(function(arg) { return arg != nextCmd })
    var nextConfig = config.commands.filter(function(_cmd) { return _cmd.name == nextCmd })

    if (nextConfig.length == 0) {
        return false
    }

    return match(nextConfig[0], options, nextArgs, nextCmd)

}

module.exports = function(config, options) {
  options = options || {}
  config  = Array.isArray(config) ? { commands: config } : config
  return match.bind(undefined, config, options)
}
