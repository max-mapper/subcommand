var minimist = require('minimist')
//  var cliclopts = require('cliclopts')
//  var xtend = require('xtend')
var debug = require('debug')('subcommand')

function match(config, options, args, cmd) {
    debug('cmd', cmd)
    debug('args',args)
    debug('config',config)
    var argv = minimist(args)
    debug('parsed', argv)

    // if !cmd -> initial -> fix

    if (cmd && cmd == config.name) {
        config.command(argv)
        return true
    } 

    var nextCmd = argv._.shift()
    var nextArgs = args.filter(function(arg) { return arg != nextCmd })
    var nextConfig = config.commands.filter(function(_cmd) { return _cmd.name == nextCmd })

    debug('nextCmd', nextCmd)
    debug('nextArgs', nextArgs)
    debug('nextConfig', nextConfig)

    // if !nextConfig -> die
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
