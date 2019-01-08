var Buffer = require("buffer/").Buffer;
var should = require("should");
var qzeonjs = require("../../index.js");

describe("ipfs.js", function () {

  var ipfs = qzeonjs.ipfs;

  it("should be ok", function () {
    (ipfs).should.be.ok;
  });

  it("should be object", function () {
    (ipfs).should.be.type("object");
  });

  it("should have createHashRegistration property", function () {
    (ipfs).should.have.property("createHashRegistration");
  });

  it("should create transaction with fee override", function () {
    const feeOverride = 1000000
    var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret", undefined, feeOverride);
    (trs).should.be.ok;
    (trs.fee).should.equal(feeOverride)
  });

  it("should fail to create transaction with invalid fee override", function (done) {
    const feeOverride = '1000000'
    try {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret", undefined, feeOverride);
      (trs).should.be.ok;
      should.fail()
    } catch (error) {
      done()
    }
  });

  it("should create transaction with hashid", function () {
    var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
    (trs).should.be.ok;
  });

  it("should be deserialised correctly", function () {
    var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
    var deserialisedTx = qzeonjs.crypto.fromBytes(qzeonjs.crypto.getBytes(trs).toString("hex"));
    var keys = Object.keys(deserialisedTx);
    for (var key in keys) {
      deserialisedTx[keys[key]].should.equal(trs[keys[key]]);
    }
  });

  describe("returned transaction", function () {
    it("should be object", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      (trs).should.be.type("object");
    });

    it("should have id as string", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      (trs.id).should.be.type("string");
    });

    it("should have vendorField as string", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      (trs.vendorFieldHex).should.be.type("string");
    });

    it("should have vendorFieldHex equal to '00000000000000000000516d5732575169376a36633755674a546172416374703774444e696b453442327158744643664c506473676154512f6361742e6a7067'", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      (trs.vendorFieldHex).should.be.type("string").and.equal('00000000000000000000516d5732575169376a36633755674a546172416374703774444e696b453442327158744643664c506473676154512f6361742e6a7067');
    });

    it("should have type as number and equal 5", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      (trs.type).should.be.type("number").and.equal(5);
    });

    it("should have timestamp as number", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      (trs.timestamp).should.be.type("number").and.not.NaN;
    });

    it("should have senderPublicKey as hex string", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      (trs.senderPublicKey).should.be.type("string").and.match(function () {
        try {
          new Buffer(trs.senderPublicKey, "hex")
        } catch (e) {
          return false;
        }

        return true;
      })
    });

    it("should have amount as number and equal to 0", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      (trs.amount).should.be.type("number").and.equal(0);
    });

    it("should have empty asset object", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      (trs.asset).should.be.type("object").and.empty;
    });

    it("should does not have second signature", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      (trs).should.not.have.property("signSignature");
    });

    it("should have signature as hex string", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      (trs.signature).should.be.type("string").and.match(function () {
        try {
          new Buffer(trs.signature, "hex")
        } catch (e) {
          return false;
        }

        return true;
      })
    });

    it("should be signed correctly", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      var result = qzeonjs.crypto.verify(trs);
      (result).should.be.ok;
    });

    it("should not be signed correctly now (changed amount)", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      trs.amount = 10000;
      var result = qzeonjs.crypto.verify(trs);
      (result).should.be.not.ok;
    });

    it("should not be signed correctly now (changed vendorField)", function () {
      var trs = ipfs.createHashRegistration("QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg", "secret");
      trs.vendorField = "bouloup";
      var result = qzeonjs.crypto.verify(trs);
      (result).should.be.not.ok;
    });
  });

});
