/* global describe, it, beforeEach */
/* eslint-disable no-new */

var assert = require('assert')
var ecdsa = require('../../lib/ecdsa')
var ecurve = require('ecurve')
var proxyquire = require('proxyquire')
var sinon = require('sinon')
var sinonTest = require('sinon-test')(sinon)

var BigInteger = require('bigi')
var ECPair = require('../../lib/ecpair')

var fixtures = require('./fixtures.json')
var curve = ecdsa.__curve

var NETWORKS = require('../../lib/networks')
var NETWORKS_LIST = [] // Object.values(NETWORKS)
for (var networkName in NETWORKS) {
  NETWORKS_LIST.push(NETWORKS[networkName])
}

describe('ECPair', function () {
  describe('constructor', function () {
    it('defaults to compressed', function () {
      var keyPair = new ECPair(BigInteger.ONE)

      assert.strictEqual(keyPair.compressed, true)
    })

    it('supports the uncompressed option', function () {
      var keyPair = new ECPair(BigInteger.ONE, null, {
        compressed: false
      })

      assert.strictEqual(keyPair.compressed, false)
    })

    it('supports the network option', function () {
      var keyPair = new ECPair(BigInteger.ONE, null, {
        compressed: false,
        network: NETWORKS.devnet
      })

      assert.strictEqual(keyPair.network, NETWORKS.devnet)
    })

    fixtures.valid.forEach(function (f) {
      it('calculates the public point for ' + f.WIF, function () {
        var d = new BigInteger(f.d)
        var keyPair = new ECPair(d, null, {
          compressed: f.compressed
        })

        assert.strictEqual(keyPair.getPublicKeyBuffer().toString('hex'), f.Q)
      })
    })

    fixtures.invalid.constructor.forEach(function (f) {
      it('throws ' + f.exception, function () {
        var d = f.d && new BigInteger(f.d)
        var Q = f.Q && ecurve.Point.decodeFrom(curve, new Buffer(f.Q, 'hex'))

        assert.throws(function () {
          new ECPair(d, Q, f.options)
        }, new RegExp(f.exception))
      })
    })
  })

  describe('getPublicKeyBuffer', function () {
    var keyPair

    beforeEach(function () {
      keyPair = new ECPair(BigInteger.ONE)
    })

    it('wraps Q.getEncoded', sinonTest(function () {
      this.mock(keyPair.Q).expects('getEncoded')
        .once().withArgs(keyPair.compressed)

      keyPair.getPublicKeyBuffer()
    }))
  })

  describe('fromWIF', function () {
    fixtures.valid.forEach(function (f) {
      it('imports ' + f.WIF + ' (' + f.network + ')', function () {
        var network = NETWORKS[f.network]
        var keyPair = ECPair.fromWIF(f.WIF, network)

        assert.strictEqual(keyPair.d.toString(), f.d)
        assert.strictEqual(keyPair.getPublicKeyBuffer().toString("hex"), f.Q)
        assert.strictEqual(keyPair.compressed, f.compressed)
        assert.strictEqual(keyPair.network, network)
      })
    })

    /*
     * This test doesn't work when multiple networks with same wif are present
     *
     *
    fixtures.valid.forEach(function (f) {
      it('imports ' + f.WIF + ' (via list of networks)', function () {
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS_LIST)

        assert.strictEqual(keyPair.d.toString(), f.d)
        assert.strictEqual(keyPair.getPublicKeyBuffer().toString("hex"), f.Q)
        assert.strictEqual(keyPair.compressed, f.compressed)
        assert.strictEqual(keyPair.network, NETWORKS[f.network])
      })
    })*/

    fixtures.invalid.fromWIF.forEach(function (f) {
      it('throws on ' + f.WIF, function () {
        assert.throws(function () {
          var networks = f.network ? NETWORKS[f.network] : NETWORKS_LIST

          ECPair.fromWIF(f.WIF, networks)
        }, new RegExp(f.exception))
      })
    })
  })

  describe('toWIF', function () {
    fixtures.valid.forEach(function (f) {
      it('exports ' + f.WIF, function () {
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS[f.network])
        var result = keyPair.toWIF()

        assert.strictEqual(result, f.WIF)
      })
    })
  })

  describe('makeRandom', function () {
    var d = new Buffer('0404040404040404040404040404040404040404040404040404040404040404', 'hex')
    var exWIF = '8pR9uX3msKxfR5UgYM43dkjVjayUp6YpgecU2618GZosTcJmZAL'

    describe('uses randombytes RNG', function () {
      it('generates a ECPair', function () {
        var stub = { randombytes: function () { return d } }
        var ProxiedECPair = proxyquire('../../lib/ecpair', stub)

        var keyPair = ProxiedECPair.makeRandom()
        assert.strictEqual(keyPair.toWIF(), exWIF)
      })
    })

    it('allows a custom RNG to be used', function () {
      var keyPair = ECPair.makeRandom({
        rng: function (size) { return d.slice(0, size) }
      })

      assert.strictEqual(keyPair.toWIF(), exWIF)
    })

    it('retains the same defaults as ECPair constructor', function () {
      var keyPair = ECPair.makeRandom()

      assert.strictEqual(keyPair.compressed, true)
      assert.strictEqual(keyPair.network, NETWORKS.zeon)
    })

    it('supports the options parameter', function () {
      var keyPair = ECPair.makeRandom({
        compressed: false,
        network: NETWORKS.devnet
      })

      assert.strictEqual(keyPair.compressed, false)
      assert.strictEqual(keyPair.network, NETWORKS.devnet)
    })

    it('loops until d is within interval [1, n - 1] : 1', sinonTest(function () {
      var rng = this.mock()
      rng.exactly(2)
      rng.onCall(0).returns(BigInteger.ZERO.toBuffer(32)) // invalid length
      rng.onCall(1).returns(BigInteger.ONE.toBuffer(32)) // === 1

      ECPair.makeRandom({ rng: rng })
    }))

    it('loops until d is within interval [1, n - 1] : n - 1', sinonTest(function () {
      var rng = this.mock()
      rng.exactly(3)
      rng.onCall(0).returns(BigInteger.ZERO.toBuffer(32)) // < 1
      rng.onCall(1).returns(curve.n.toBuffer(32)) // > n-1
      rng.onCall(2).returns(curve.n.subtract(BigInteger.ONE).toBuffer(32)) // === n-1

      ECPair.makeRandom({ rng: rng })
    }))
  })

  describe('getAddress', function () {
    fixtures.valid.forEach(function (f) {
      it('returns ' + f.address + ' for ' + f.WIF, function () {
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS[f.network])

        assert.strictEqual(keyPair.getAddress(), f.address)
      })
    })
  })

  describe('getNetwork', function () {
    fixtures.valid.forEach(function (f) {
      it('returns ' + f.network + ' for ' + f.WIF, function () {
        var network = NETWORKS[f.network]
        var keyPair = ECPair.fromWIF(f.WIF, NETWORKS[f.network])

        assert.strictEqual(keyPair.getNetwork(), network)
      })
    })
  })

  describe('ecdsa wrappers', function () {
    var keyPair, hash

    beforeEach(function () {
      keyPair = ECPair.makeRandom()
      hash = new Buffer(32)
    })

    describe('signing', function () {
      //  it('wraps ecdsa.sign', sinonTest(function () {
      //    this.mock(ecdsa).expects('sign')
      //      .once().withArgs(hash, keyPair.d)
      //
      //    keyPair.sign(hash)
      //  }))

      it('throws if no private key is found', function () {
        keyPair.d = null

        assert.throws(function () {
          keyPair.sign(hash)
        }, /Missing private key/)
      })
    })

    describe('verify', function () {
      /*
      beforeEach(function () {
        var signature = keyPair.sign(hash)
      })*/

      // it('wraps ecdsa.verify', sinonTest(function () {
      //   this.mock(ecdsa).expects('verify')
      //     .once().withArgs(hash, signature, keyPair.Q)
      //
      //   keyPair.verify(hash, signature)
      // }))
    })
  })
})
