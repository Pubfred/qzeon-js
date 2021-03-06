/* global describe, it */

var assert = require('assert')
var bigi = require('bigi')
var qzeonjs = require('../../')
var crypto = require('crypto')

var ecurve = require('ecurve')
var secp256k1 = ecurve.getCurveByName('secp256k1')

describe('zeon-js (BIP32)', function () {
  it('can create a BIP32 wallet external address', function () {
    var path = "m/0'/0/0"
    var root = qzeonjs.HDNode.fromSeedHex('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd')

    var child1 = root.derivePath(path)

    // option 2, manually
    var child2 = root.deriveHardened(0)
      .derive(0)
      .derive(0)

    assert.equal(child1.getAddress(), 'ZVo1ZeQfjZokNE3v4SSpvkyqs31ZFKxuk5')
    assert.equal(child2.getAddress(), 'ZVo1ZeQfjZokNE3v4SSpvkyqs31ZFKxuk5')
  })

  it('can create a BIP44, zeon, account 0, external address', function () {
    var path = "m/44'/0'/0'/0/0"
    var root = qzeonjs.HDNode.fromSeedHex('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd')

    var child1 = root.derivePath(path)

    // option 2, manually
    var child2 = root.deriveHardened(44)
      .deriveHardened(0)
      .deriveHardened(0)
      .derive(0)
      .derive(0)

    assert.equal(child1.getAddress(), 'ZRrujDKQSAwan66vojoHN7PdThuzwf4Mc6')
    assert.equal(child2.getAddress(), 'ZRrujDKQSAwan66vojoHN7PdThuzwf4Mc6')
  })

  it('can recover a BIP32 parent private key from the parent public key, and a derived, non-hardened child private key', function () {
    function recoverParent (master, child) {
      assert(!master.keyPair.d, 'You already have the parent private key')
      assert(child.keyPair.d, 'Missing child private key')

      var curve = secp256k1
      var QP = master.keyPair.Q
      var serQP = master.keyPair.getPublicKeyBuffer()

      var d1 = child.keyPair.d
      var d2
      var data = new Buffer(37)
      serQP.copy(data, 0)

      // search index space until we find it
      for (var i = 0; i < qzeonjs.HDNode.HIGHEST_BIT; ++i) {
        data.writeUInt32BE(i, 33)

        // calculate I
        var I = crypto.createHmac('sha512', master.chainCode).update(data).digest()
        var IL = I.slice(0, 32)
        var pIL = bigi.fromBuffer(IL)

        // See hdnode.js:273 to understand
        d2 = d1.subtract(pIL).mod(curve.n)

        var Qp = new qzeonjs.ECPair(d2).Q
        if (Qp.equals(QP)) break
      }

      var node = new qzeonjs.HDNode(new qzeonjs.ECPair(d2), master.chainCode, master.network)
      node.depth = master.depth
      node.index = master.index
      node.masterFingerprint = master.masterFingerprint
      return node
    }

    var seed = crypto.randomBytes(32)
    var master = qzeonjs.HDNode.fromSeedBuffer(seed)
    var child = master.derive(6) // m/6

    // now for the recovery
    var neuteredMaster = master.neutered()
    var recovered = recoverParent(neuteredMaster, child)
    assert.strictEqual(recovered.toBase58(), master.toBase58())
  })
})
