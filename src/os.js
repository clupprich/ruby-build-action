const fs = require('fs')
const camelCase = require('camelcase')

const LINE_MATCH = /^(\w+)=["']?([\w\s\.]+)["']?$/

export function releaseInfo() {
  const content = fs.readFileSync('/etc/lsb-release', 'utf8')

  const obj = {}

  content.split("\n").forEach(function(line) {
    const matches = line.match(LINE_MATCH)

    if (matches) {
      obj[camelCase(matches[1])] = matches[2]
    }
  })

  return obj
}
