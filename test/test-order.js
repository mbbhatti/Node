var supertest = require("supertest");
var should = require("should");
const dotenv = require('dotenv').config();

// PORT reference, where program is runninng.
var server = supertest.agent(process.env.APP_URL +':'+ process.env.APP_PORT);

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
            if (res.error == false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
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
            if (res.error == false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
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
            if (res.error == false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
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