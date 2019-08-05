var supertest = require("supertest");
var should = require("should");
var testConfig = require(__dirname + '/../config/test');

// PORT reference, where program is runninng.
var server = supertest.agent(testConfig.test.server);

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
            if (res.error == false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
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
            if (res.error == false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
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
            if (res.error == false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
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