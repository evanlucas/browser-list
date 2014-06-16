#!/usr/bin/env node

var fs = require('fs')
  , launcher = require('browser-launcher')
  , nopt = require('nopt')
  , Table = require('cli-table')
  , sh = { help: Boolean
         , version: Boolean
         , json: Boolean
         , names: Boolean
         }
  , ko = { h: ['--help']
         , v: ['--version']
         , j: ['--json']
         , n: ['--names']
         }
  , parsed = nopt(sh, ko)

if (parsed.help) {
  usage(0)
  return
}

if (parsed.version) {
  console.log('browser-list', 'v'+require('../package').version)
  return
}

launcher.detect(function(browsers) {
  if (parsed.names) {
    browsers = browsers.map(function(b) {
      return b.name
    })
  }
  if (parsed.json) {
    console.log(browsers)
    return
  } else {
    if (parsed.names) {
      var table = new Table({
        head: ['Name']
      })
      browsers.forEach(function(b) {
        table.push([b])
      })
      console.log(table.toString())
    } else {
      var table = new Table({
        head: ['Name', 'Version', 'Command']
      })
      browsers.forEach(function(b) {
        table.push([b.name, b.version, b.command])
      })

      console.log(table.toString())
    }
  }
})

function usage(code) {
  var rs = fs.createReadStream(__dirname + '/usage.txt')
  rs.pipe(process.stdout)
  rs.on('close', function() {
    if (code) process.exit(code)
  })
}
