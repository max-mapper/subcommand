var test = require('tape')
var sub = require('./')

function testCommands (onMatch) {
  var commands = [
    {
      name: '',
      options: [{
        name: 'version',
        boolean: true,
        abbr: 'v'
      }],
      command: function noCommand (args) {
        onMatch('noCommand', args)
      }
    },
    {
      name: 'cat',
      options: [
        {
          name: 'live',
          boolean: true,
          default: true,
          abbr: 'l'
        },
        {
          name: 'format',
          boolean: false,
          default: 'csv',
          abbr: 'f'
        }
      ],
      command: function cat (args) {
        onMatch('cat', args)
      }
    },
    {
      name: 'cat foo',
      command: function catFoo (args) {
        onMatch('cat foo', args)
      }
    },
    {
      name: 'cat foo bar',
      command: function catFooBar (args) {
        onMatch('cat foo bar', args)
      }
    }
  ]
  return commands
}

test('match basic command with no args', function (t) {
  var args = sub([{
    name: 'foo',
    command: function foo (args) {
      t.equal(args._.length, 0, 'no args')
      t.end()
    }
  }])
  var handled = args(['foo'])
  t.equal(handled, true, 'returned true')
})

test('match basic command with 1 extra arg', function (t) {
  var args = sub([{
    name: 'foo',
    command: function foo (args) {
      t.equal(args._.length, 1, '1 arg')
      t.equal(args._[0], 'bar', 'bar')
      t.end()
    }
  }])
  var handled = args(['foo', 'bar'])
  t.equal(handled, true, 'returned true')
})

test('match basic command with 5 extra args', function (t) {
  var args = sub([{
    name: 'foo',
    command: function foo (args) {
      t.equal(args._.length, 5, '5 args')
      t.equal(JSON.stringify(args._), JSON.stringify(['bar', 'taco', 'pizza', 'walrus', 'muffin']), 'args match')
      t.end()
    }
  }])
  var handled = args(['foo', 'bar', 'taco', 'pizza', 'walrus', 'muffin'])
  t.equal(handled, true, 'returned true')
})

test('match 1 arg command w/ 1 extra arg', function (t) {
  function onMatch (matched, args) {
    t.equal(matched, 'cat')
    t.equal(args._.length, 1, '1 arg')
    t.equal(args._[0], 'taco', 'taco')
    t.end()
  }
  var args = sub(testCommands(onMatch))
  var handled = args(['cat', 'taco'])
  t.equal(handled, true, 'returned true')
})

test('match 2 arg command w/ 1 extra arg', function (t) {
  function onMatch (matched, args) {
    t.equal(matched, 'cat foo')
    t.equal(args._.length, 1, '1 arg')
    t.equal(args._[0], 'baz', 'baz')
    t.end()
  }
  var args = sub(testCommands(onMatch))
  var handled = args(['cat', 'foo', 'baz'])
  t.equal(handled, true, 'returned true')
})

test('match 3 arg command w/ 1 extra arg', function (t) {
  function onMatch (matched, args) {
    t.equal(matched, 'cat foo bar')
    t.equal(args._.length, 1, '1 arg')
    t.equal(args._[0], 'muffin', 'muffin')
    t.end()
  }
  var args = sub(testCommands(onMatch))
  var handled = args(['cat', 'foo', 'bar', 'muffin'])
  t.equal(handled, true, 'returned true')
})

test('match top level option using abbr', function (t) {
  function onMatch (matched, args) {
    t.equal(matched, 'noCommand')
    t.equal(args.version, true, 'got version')
    t.end()
  }
  var args = sub(testCommands(onMatch))
  var handled = args(['-v'])
  t.equal(handled, true, 'returned true')
})
