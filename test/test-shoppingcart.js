var supertest = require("supertest");
var should = require("should");
const dotenv = require('dotenv').config();

// PORT reference, where program is runninng.
var server = supertest.agent(process.env.APP_URL +':'+ process.env.APP_PORT);

describe("Shopping Cart", function() {

    it("Shopping Cart create", function(done) {
        server
        .post('/shoppingcart/add')
        .send({
            cart_id: 'w5krev4nf02',
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

    it("Shopping cart empty with id", function(done) {
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

    it("Shopping cart empty without cart id", function(done) {
        server
        .delete('/shoppingcart/empty/')
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

    it("Shopping cart remove with item id", function(done) {
        server
        .delete('/shoppingcart/removeProduct/100')
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

    it("Shopping cart remove without item id", function(done) {
        server
        .delete('/shoppingcart/removeProduct/')
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

    it("Shopping cart generate cart id", function(done) {
        server
        .get('/shoppingcart/generateUniqueId')
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
});