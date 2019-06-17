var supertest = require("supertest");
var should = require("should");
var testConfig = require(__dirname + '/../config/test');

// PORT reference, where program is runninng.
var server = supertest.agent(testConfig.test.server);

describe("Shopping Cart", function() {

    it("Shopping Cart create without error", function(done) {
        server
        .post('/shoppingcart/add')
        .send({
            cart_id: 1,
            product_id: 1,
            attributes: 'Sony'
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error == false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
            }
            done();
        });
    });

    it("Shopping Cart create with error", function(done) {
        server
        .post('/shoppingcart/add')
        .send({
            cart_id: '',
            product_id: 1,
            attributes: 'Sony'
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error == false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
            }
            done();
        });
    });

    it("Shopping cart Delete", function(done) {
        server
        .delete('/shoppingcart/empty/100')
        .expect(200)
        .end(function(err, res) {
            if (res.error == false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
            }
            done();
        });
    });
});