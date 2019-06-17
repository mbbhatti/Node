var supertest = require("supertest");
var should = require("should");
var testConfig = require(__dirname + '/../config/test');

// PORT reference, where program is runninng.
var server = supertest.agent(testConfig.test.server);

describe("Customer", function() {

    it("Login", function(done) {
        server
        .post('/customers/login')
        .send({
            email: 'abc@xyz.com',
            password: '123456'
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

    it("Register", function(done) {
        server
        .post('/customers')
        .send({
            name: "abc",
            email: 'mbbhatti@xyz.com',
            password: '123456'
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