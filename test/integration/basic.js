/* global describe, it */

var assert = require('assert')
var bigi = require('bigi')
var qzeonjs = require('../../')

describe('zeon-js (basic)', function () {
  it('can generate a random zeon address', function () {
    // for testing only
    function rng () { return new Buffer('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }

    // generate random keyPair
    var keyPair = qzeonjs.ECPair.makeRandom({ rng: rng })
    var address = keyPair.getAddress()

    assert.strictEqual(address, 'ZK4jdRHaCj3Adxdk66KWAnrqVTkujto8Wf')
  })

  it('can generate an address from a SHA256 hash', function () {
    var hash = qzeonjs.crypto.sha256('correct horse battery staple')
    var d = bigi.fromBuffer(hash)

    var keyPair = new qzeonjs.ECPair(d)
    var address = keyPair.getAddress()

    assert.strictEqual(address, 'ZCLZ1xho4yL1dMHsZRmav5GCnPBPbCZeHY')
  })

  it('can generate a random keypair for alternative networks', function () {
    // for testing only
    function rng () { return new Buffer('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }

    var bitcoin = qzeonjs.networks.bitcoin

    var keyPair = qzeonjs.ECPair.makeRandom({ network: bitcoin, rng: rng })
    var wif = keyPair.toWIF()
    var address = keyPair.getAddress()

    assert.strictEqual(address, '182UrjSXQHy5DHUp8Xg1Nm5u979SojJY2P')
    assert.strictEqual(wif, 'L1Knwj9W3qK3qMKdTvmg3VfzUs3ij2LETTFhxza9LfD5dngnoLG1')
  })

  it('can import an address via WIF', function () {
    var keyPair = qzeonjs.ECPair.fromWIF('8q8qpjJiKSSEZtDbdyQEL5oxe4SYkgyQVPJYWWCr9JudRAL8Q3q')
    var address = keyPair.getAddress()
    console.log("address : "  + address) 
    assert.strictEqual(address, 'ZNxSmGMQo5MXucGLX4gT59pVyHd4XbSiNZ')
  })

})
