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

describe("Orders", function() {    

    it("Create order", function(done) {
        this.timeout(50000);
        server
        .post('/orders')
        .send({
            cart_id: 'w5krev4nf02',
            shipping_id: 1,
            tax_id: 1
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .set('USER-KEY', process.env.AUTH_TEST_TOKEN)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Create order with wrong cart id", function(done) {
        server
        .post('/orders')
        .send({
            cart_id: 'abc123',
            shipping_id: 1,
            tax_id: 1
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .set('USER-KEY', process.env.AUTH_TEST_TOKEN)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Create order with wrong shipping id", function(done) {
        server
        .post('/orders')
        .send({
            cart_id: 1,
            shipping_id: 'ab',
            tax_id: 1
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .set('USER-KEY', process.env.AUTH_TEST_TOKEN)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Create order with wrong tax id", function(done) {
        server
        .post('/orders')
        .send({
            cart_id: 1,
            shipping_id: 1,
            tax_id: 'abc'
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .set('USER-KEY', process.env.AUTH_TEST_TOKEN)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });
});