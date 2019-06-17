var supertest = require("supertest");
var should = require("should");
var testConfig = require(__dirname + '/../config/test');

// PORT reference, where program is runninng.
var server = supertest.agent(testConfig.test.server);

describe("Orders", function() {    

    it("Create order and send email", function(done) {
        this.timeout(10000);
        server
        .post('/orders')
        .send({
            cart_id: 1,
            shipping_id: 1,
            tax_id: 1
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .set('USER-KEY', 'Bearer ' + testConfig.test.token)
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