var Buffer = require("buffer/").Buffer;
var should = require("should");
var qzeonjs = require("../../index.js");
var ECPair = require('../../lib/ecpair');

var ecdsa = require('../../lib/ecdsa')
var ecurve = require('ecurve')
var curve = ecdsa.__curve

describe("crypto.js", function () {

  var crypto = qzeonjs.crypto;

  it("should be ok", function () {
    (crypto).should.be.ok;
  });

  it("should be object", function () {
    (crypto).should.be.type("object");
  });

  it("should has properties", function () {
    var properties = ["getBytes", "getHash", "getId", "getFee", "sign", "secondSign", "getKeys", "getAddress", "verify", "verifySecondSignature", "fixedPoint"];
    properties.forEach(function (property) {
      (crypto).should.have.property(property);
    });
  });

  describe("#getBytes", function () {
    var getBytes = crypto.getBytes;
    var bytes = null;

    it("should be ok", function () {
      (getBytes).should.be.ok;
    });

    it("should be a function", function () {
      (getBytes).should.be.type("function");
    });

    it("should return Buffer of simply transaction and buffer must be 202 length", function () {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: "ZYMZuYJKKWsmWQzuLzAwCqJaVsu7aQ4ss2",
        timestamp: 141738,
        asset: {},
        senderPublicKey: "0245678A36D836DABC25DD6BBF1B1FACA55DE1BCCED1BFA20E94E5C6DC18D6435B",
        signature: "618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a",
        id: "13987348420913138422"
      };

      bytes = getBytes(transaction);
      (bytes).should.be.ok;
      (bytes).should.be.type("object");
      (bytes.length).should.be.equal(202);
    });

    it("should return Buffer of transaction with second signature and buffer must be 266 length", function () {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: "ZYMZuYJKKWsmWQzuLzAwCqJaVsu7aQ4ss2",
        timestamp: 141738,
        asset: {},
        senderPublicKey: "0245678A36D836DABC25DD6BBF1B1FACA55DE1BCCED1BFA20E94E5C6DC18D6435B",
        signature: "618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a",
        signSignature: "618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a",
        id: "13987348420913138422"
      };

      bytes = getBytes(transaction);
      (bytes).should.be.ok;
      (bytes).should.be.type("object");
      (bytes.length).should.be.equal(266);
    });
  });

  describe("#getHash", function () {
    var getHash = crypto.getHash;

    it("should be ok", function () {
      (getHash).should.be.ok;
    });

    it("should be a function", function () {
      (getHash).should.be.type("function");
    })

    it("should return Buffer and Buffer most be 32 bytes length", function () {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: "ZYMZuYJKKWsmWQzuLzAwCqJaVsu7aQ4ss2",
        timestamp: 141738,
        asset: {},
        senderPublicKey: "0245678A36D836DABC25DD6BBF1B1FACA55DE1BCCED1BFA20E94E5C6DC18D6435B",
        signature: "618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a",
      };

      var result = getHash(transaction);
      (result).should.be.ok;
      (result).should.be.type("object");
      (result.length).should.be.equal(32);
    });
  });

  describe("#getId", function () {
    var getId = crypto.getId;

    it("should be ok", function () {
      (getId).should.be.ok;
    });

    it("should be a function", function () {
      (getId).should.be.type("function");
    });

    it("should return string id and be equal to 47188d5669e12fd6ac6dac661e9a6b884f58793788d8fbb3e695aa9a73a87bee", function () {
      var transaction = {
        type: 0,
        amount: 1000,
        fee: 2000,
        recipientId: "ZYMZuYJKKWsmWQzuLzAwCqJaVsu7aQ4ss2",
        timestamp: 141738,
        asset: {},
        senderPublicKey: "0245678A36D836DABC25DD6BBF1B1FACA55DE1BCCED1BFA20E94E5C6DC18D6435B",
        signature: "618a54975212ead93df8c881655c625544bce8ed7ccdfe6f08a42eecfb1adebd051307be5014bb051617baf7815d50f62129e70918190361e5d4dd4796541b0a"
      };

      var id = getId(transaction);
      (id).should.be.type("string").and.equal("47188d5669e12fd6ac6dac661e9a6b884f58793788d8fbb3e695aa9a73a87bee");
    });
  });

  describe("#getFee", function () {
    var getFee = crypto.getFee;

    it("should be ok", function () {
      (getFee).should.be.ok;
    })

    it("should be a function", function () {
      (getFee).should.be.type("function");
    });

    it("should return number", function () {
      var fee = getFee({ amount: 100000, type: 0 });
      (fee).should.be.type("number");
      (fee).should.be.not.NaN;
    });

    it("should return 10000000", function () {
      var fee = getFee({ amount: 100000, type: 0 });
      (fee).should.be.type("number").and.equal(10000000);
    });

    it("should return 10000000000", function () {
      var fee = getFee({ type: 1 });
      (fee).should.be.type("number").and.equal(10000000000);
    });

    it("should be equal 1000000000000", function () {
      var fee = getFee({ type: 2 });
      (fee).should.be.type("number").and.equal(1000000000000);
    });

    it("should be equal 100000000", function () {
      var fee = getFee({ type: 3 });
      (fee).should.be.type("number").and.equal(100000000);
    });
  });

  describe("fixedPoint", function () {
    var fixedPoint = crypto.fixedPoint;

    it("should be ok", function () {
      (fixedPoint).should.be.ok;
    })

    it("should be number", function () {
      (fixedPoint).should.be.type("number").and.not.NaN;
    });

    it("should be equal 100000000", function () {
      (fixedPoint).should.be.equal(100000000);
    });
  });

  describe("#sign", function () {
    var sign = crypto.sign;

    it("should be ok", function () {
      (sign).should.be.ok;
    });

    it("should be a function", function () {
      (sign).should.be.type("function");
    });
  });

  describe("#secondSign", function () {
    var secondSign = crypto.secondSign;

    it("should be ok", function () {
      (secondSign).should.be.ok;
    });

    it("should be a function", function () {
      (secondSign).should.be.type("function");
    });
  });

  describe("#getKeys", function () {
    var getKeys = crypto.getKeys;

    it("should be ok", function () {
      (getKeys).should.be.ok;
    });

    it("should be a function", function () {
      (getKeys).should.be.type("function");
    });

    it("should return two keys in hex", function () {
      var keys = getKeys("secret");

      (keys).should.be.ok;
      (keys).should.be.type("object");
      (keys).should.have.property("publicKey");
      (keys).should.have.property("privateKey");
      (keys.publicKey).should.be.type("string").and.match(function () {
        try {
          new Buffer(keys.publicKey, "hex");
        } catch (e) {
          return false;
        }

        return true;
      });
      (keys.privateKey).should.be.type("string").and.match(function () {
        try {
          new Buffer(keys.privateKey, "hex");
        } catch (e) {
          return false;
        }

        return true;
      });
    });
  });

  describe("#getAddress", function () {
    var getAddress = crypto.getAddress;

    it("should be ok", function () {
      (getAddress).should.be.ok;
    })

    it("should be a function", function () {
      (getAddress).should.be.type("function");
    });

    it("should generate address by publicKey", function () {
      var keys = crypto.getKeys("secret");
      var address = getAddress(keys.publicKey);

      (address).should.be.ok;
      (address).should.be.type("string");
      (address).should.be.equal("ZEmokD2hqX7KxTFxNgLxavj2PnFsubBAFX");
    });

    it("should generate address by publicKey - DevNET -", function () {
      crypto.setNetworkVersion(0x80);
      var keys = crypto.getKeys("secret");
      var address = getAddress(keys.publicKey);

      (address).should.be.ok;
      (address).should.be.type("string");
      (address).should.be.equal("tYzm1RLXvBMPDFx7YpLFrwnnbzdA4Apdyf");
      crypto.setNetworkVersion(0x50);
    });

    it("should generate address by publicKey - second test", function () {
      var keys = crypto.getKeys("secret second test to be sure it works correctly");
      var address = getAddress(keys.publicKey);

      (address).should.be.ok;
      (address).should.be.type("string");
      (address).should.be.equal("ZLiDfyjCR1RCo32qL83UnNhN6L9485uvLy");
    });

    it("should generate address by publicKey - second test - DevNET", function () {
      crypto.setNetworkVersion(0x80);
      var keys = crypto.getKeys("secret second test to be sure it works correctly");
      var address = getAddress(keys.publicKey);

      (address).should.be.ok;
      (address).should.be.type("string");
      (address).should.be.equal("tewAwC32VffG3qizWG2n4Pm8JYWL9ixUwK");
      crypto.setNetworkVersion(0x50);
    });

    it("should generate the same address as ECPair.getAddress()", function () {
      var keys = crypto.getKeys("secret second test to be sure it works correctly");
      var address = getAddress(keys.publicKey);

      var Q = ecurve.Point.decodeFrom(curve, new Buffer(keys.publicKey, 'hex'))
      var keyPair = new ECPair(null, Q);

      (address).should.be.equal(keyPair.getAddress());
    });

    it("should generate the same address as ECPair.getAddress() - DevNET", function () {
      crypto.setNetworkVersion(0x80);
      var keys = crypto.getKeys("secret second test to be sure it works correctly");
      var address = getAddress(keys.publicKey);

      var Q = ecurve.Point.decodeFrom(curve, new Buffer(keys.publicKey, 'hex'))
      var keyPairD = new ECPair(null, Q, { compressed: true, network: qzeonjs.networks.devnet });

      (address).should.be.equal(keyPairD.getAddress());
      crypto.setNetworkVersion(0x50);
    });
  });

  describe("#verify", function () {
    var verify = crypto.verify;

    it("should be ok", function () {
      (verify).should.be.ok;
    })

    it("should be function", function () {
      (verify).should.be.type("function");
    });
  });

  describe("#verifySecondSignature", function () {
    var verifySecondSignature = crypto.verifySecondSignature;

    it("should be ok", function () {
      (verifySecondSignature).should.be.ok;
    });

    it("should be function", function () {
      (verifySecondSignature).should.be.type("function");
    });
  });
});

describe("different networks", function () {

  it("validate address on devnet should be ok", function () {
    qzeonjs.crypto.setNetworkVersion(0x80);
    qzeonjs.crypto.getNetworkVersion().should.equal(0x4B);
    var validate = qzeonjs.crypto.validateAddress("XE5npfYGHcnwsHZXFagNAJN6FFyAM542Bh");
    (validate).should.equal(true);
    qzeonjs.crypto.setNetworkVersion(0x50);
    qzeonjs.crypto.getNetworkVersion().should.equal(0x50);
  });
});

describe("delegate.js", function () {
  var delegate = qzeonjs.delegate;

  it("should be ok", function () {
    (delegate).should.be.ok;
  });

  it("should be function", function () {
    (delegate).should.be.type("object");
  });

  it("should have property createDelegate", function () {
    (delegate).should.have.property("createDelegate");
  });

  describe("#createDelegate", function () {
    var createDelegate = delegate.createDelegate;
    var trs = null;

    it("should be ok", function () {
      (createDelegate).should.be.ok;
    });

    it("should be function", function () {
      (createDelegate).should.be.type("function");
    });

    it("should create delegate", function () {
      trs = createDelegate("secret", "delegate", "secret 2");
    });

    it("should create transaction with fee override", function () {
      const feeOverride = 1000000
      trs = createDelegate('secret', 'delegate', 'second secret', feeOverride);
      (trs).should.be.ok;
      (trs.fee).should.equal(feeOverride)
    });

    it("should fail to create transaction with invalid fee override", function (done) {
      const feeOverride = '1000000'
      try {
        trs = createDelegate('secret', 'delegate', 'second secret', feeOverride);
        should.fail()
      } catch (error) {
        done()
      }
    });

    it("should be deserialised correctly", function () {
      var deserialisedTx = qzeonjs.crypto.fromBytes(qzeonjs.crypto.getBytes(trs).toString("hex"));
      delete deserialisedTx.vendorFieldHex;
      var keys = Object.keys(deserialisedTx)
      for (var key in keys) {
        if (keys[key] == "asset") {
          deserialisedTx.asset.delegate.username.should.equal(trs.asset.delegate.username);
        }
        else {
          deserialisedTx[keys[key]].should.equal(trs[keys[key]]);
        }
      }
    });

    describe("returned delegate", function () {
      var keys = qzeonjs.crypto.getKeys("secret");
      var secondKeys = qzeonjs.crypto.getKeys("secret 2");

      it("should be ok", function () {
        (trs).should.be.ok;
      });

      it("should be object", function () {
        (trs).should.be.type("object");
      });

      it("should have recipientId equal null", function () {
        (trs).should.have.property("recipientId").and.type("object").and.be.empty;
      })

      it("shoud have amount equal 0", function () {
        (trs).should.have.property("amount").and.type("number").and.equal(0);
      })

      it("should have type equal 2", function () {
        (trs).should.have.property("type").and.type("number").and.equal(2);
      });

      // it("should have id equal 11636400490162225218", function () {
      // 	(trs).should.have.property("id").and.type("string").and.equal('11636400490162225218');
      // });

      it("should have timestamp number", function () {
        (trs).should.have.property("timestamp").and.type("number");
      });

      it("should have senderPublicKey in hex", function () {
        (trs).should.have.property("senderPublicKey").and.type("string").and.match(function () {
          try {
            new Buffer(trs.senderPublicKey, "hex");
          } catch (e) {
            return false;
          }

          return true;
        }).and.equal(keys.publicKey);
      });

      it("should have signature in hex", function () {
        (trs).should.have.property("signature").and.type("string").and.match(function () {
          try {
            new Buffer(trs.signature, "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should have second signature in hex", function () {
        (trs).should.have.property("signSignature").and.type("string").and.match(function () {
          try {
            new Buffer(trs.signSignature, "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should have delegate asset", function () {
        (trs).should.have.property("asset").and.type("object");
        (trs.asset).should.have.have.property("delegate");
      })

      it("should be signed correctly", function () {
        var result = qzeonjs.crypto.verify(trs);
        (result).should.be.ok;
      });

      it("should be second signed correctly", function () {
        var result = qzeonjs.crypto.verifySecondSignature(trs, secondKeys.publicKey);
        (result).should.be.ok;
      });

      it("should not be signed correctly now", function () {
        trs.amount = 100;
        var result = qzeonjs.crypto.verify(trs);
        (result).should.be.not.ok;
      });

      it("should not be second signed correctly now", function () {
        trs.amount = 100;
        var result = qzeonjs.crypto.verifySecondSignature(trs, secondKeys.publicKey);
        (result).should.be.not.ok;
      });

      describe("delegate asset", function () {
        it("should be ok", function () {
          (trs.asset.delegate).should.be.ok;
        });

        it("should be object", function () {
          (trs.asset.delegate).should.be.type("object");
        });

        it("should be have property username", function () {
          (trs.asset.delegate).should.have.property("username").and.be.type("string").and.equal("delegate");
        });
      });
    });
  });

});
