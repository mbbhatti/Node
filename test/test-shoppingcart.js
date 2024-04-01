const supertest = require("supertest");
const should = require("should");
const dotenv = require('dotenv').config();

// Make sure environment variables are properly set
if (!process.env.URL || !process.env.PORT) {
    console.error("Please set the URL and PORT environment variables.");
    process.exit(1);
}

// PORT reference, where program is running
const server = supertest.agent(process.env.URL + ':' + process.env.PORT);

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
            if (res.error === false) {
                res.status.should.equal(200);
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
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Shopping cart empty with id", function(done) {
        server
        .delete('/shoppingcart/empty/100')
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Shopping cart empty without cart id", function(done) {
        server
        .delete('/shoppingcart/empty/')
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Shopping cart remove with item id", function(done) {
        server
        .delete('/shoppingcart/removeProduct/100')
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Shopping cart remove without item id", function(done) {
        server
        .delete('/shoppingcart/removeProduct/')
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
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
            if (res.error === false) {;
                res.status.should.equal(200);
            }
            done();
        });
    });
});