#!/usr/bin/env node
process.stdin.setEncoding("utf8")

var byline = require("byline")
var fs = require("fs")
var protocols = [], ends = [], suffixes = [], starts = [], noends = [], words = []
var file = process.argv[2] || __dirname + "/bullshit"
var stream = Boolean(process.stdin.isTTY) ?  byline(fs.createReadStream(file)) : byline.createStream(process.stdin)

stream.on("data", function (chunk) {
  chunk = chunk.toString()
  var fields = chunk.split(" ")
  switch (fields[1]) {
  case "*":
    protocols.push(fields[0])
    break
  case "$":
    ends.push(fields[0])
    break
  case "%":
    suffixes.push(fields[0])
    break
  case "^":
    starts.push(fields[0])
    break
  case "|":
    noends.push(fields[0])
  default:
    words.push(fields[0])
  }
})

stream.on("end", function() {
  with (Math) {
    Array.prototype.random = function () {
      return this[(random() * this.length)| 0]
    }

    var hasSuffix, last

    var throwDice = function throwDice (out) {
      var total = ((random() * 7) | 0) + 3
      this.out || (this.out = 0)
      this.out += (out | 0)
      return random() * min(3, total - this.out) | 0
    }

    var maybeSuffix = function maybeSuffix () {
      return hasSuffix = (random() < 0.2 ? suffixes.random() : "")
    }

    var withDice = function withDice (body) {
      this.n || (this.n = 0)
      var i = 0
      this.n = throwDice(this.n)
      while (i < n) {
        i++, body()
      }
    }

    var writeWord = function writeWord () {
      var word = words.random()
      while (word == last) word = words.random()
      withDice(function () {
        process.stdout.write((last = word) + maybeSuffix() + " ")
      })
    }

    withDice(function () {
      process.stdout.write((last = starts.random()) + " ")
    })

    writeWord()

    if (random() > 0.5) {
      withDice(function () {
        var over = withDice.i != n - 1 ? " over " : ""
        process.stdout.write((last = protocols.random()) + over)
      })
    }

    writeWord()

    if (random() < 0.1 || noends.indexOf(last) || hasSuffix) {
      process.stdout.write(ends.random())
    }

    process.stdout.write("\n")
  }
})
