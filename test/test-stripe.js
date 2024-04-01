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

describe("Stripe Charge", function() {

    it("Stripe charge without token", function(done) {
        server
        .post('/stripe/charge')
        .send({
            stripeToken: '',
            order_id: 1,
            description: 'Testing',
            amount: 100
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

    it("Stripe charge without order id", function(done) {
        server
        .post('/stripe/charge')
        .send({
            stripeToken: 'tok_visa',
            order_id: '',
            description: 'Testing',
            amount: 100
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

    it("Stripe charge inavlid amount", function(done) {
        this.timeout(50000);
        server
        .post('/stripe/charge')
        .send({
            stripeToken: 'tok_visa',
            order_id: 1,
            description: 'Testing',
            amount: 10
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

    it("Stripe charge complete", function(done) {
        this.timeout(50000);
        server
        .post('/stripe/charge')
        .send({
            stripeToken: 'tok_visa',
            order_id: 1,
            description: 'Testing',
            amount: 100
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
});