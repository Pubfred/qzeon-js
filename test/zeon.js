var should = require("should");
var zeon = require("../index.js");

describe("ZEON JS", function () {

	it("should be ok", function () {
		(zeon).should.be.ok;
	});

	it("should be object", function () {
		(zeon).should.be.type("object");
	});

	it("should have properties", function () {
		var properties = ["transaction", "signature", "vote", "delegate", "crypto"];

		properties.forEach(function (property) {
			(zeon).should.have.property(property);
		});
	});

});
