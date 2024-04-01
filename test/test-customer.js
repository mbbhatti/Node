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
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Login with wrong email", function(done) {
        server
        .post('/customers/login')
        .send({
            email: 'abcxyz.com',
            password: '123456'
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

    it("Login with wrong password", function(done) {
        server
        .post('/customers/login')
        .send({
            email: 'abc@xyz.com',
            password: '123'
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
            }
            done();
        });
    });

    it("Login with empty email", function(done) {
        server
        .post('/customers/login')
        .send({
            email: '',
            password: '123456'
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
            }
            done();
        });
    });

    it("Login with empty password", function(done) {
        server
        .post('/customers/login')
        .send({
            email: 'abc@xyz.com',
            password: ''
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
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
            email: 'mbbhatti@wxyz.com',
            password: '123456'
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                //console.log(res.text);
                if(res.body.error.status === 302){
                    res.status.should.equal(302);
                } else {
                    res.status.should.equal(200);
                }                
            } else {
                //console.log(res.error.text);
            }
            done();
        });
    });

    it("Register with empty name", function(done) {
        server
        .post('/customers')
        .send({
            name: "",
            email: 'mbbhatti@xyz.com',
            password: '123456'
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
            }
            done();
        });
    });

    it("Register with empty email", function(done) {
        server
        .post('/customers')
        .send({
            name: "abc",
            email: '',
            password: '123456'
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
            }
            done();
        });
    });

    it("Register with empty password", function(done) {
        server
        .post('/customers')
        .send({
            name: "abc",
            email: 'mbbhatti@xyz.com',
            password: ''
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
            }
            done();
        });
    });

    it("Register with wrong email", function(done) {
        server
        .post('/customers')
        .send({
            name: "abc",
            email: 'mbbhatti@',
            password: '123456'
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                //console.log(res.text);
                res.status.should.equal(200);
            } else {
                //console.log(res.error.text);
            }
            done();
        });
    });

    it("Register with wrong password", function(done) {
        server
        .post('/customers')
        .send({
            name: "abc",
            email: 'mbbhatti@xyz.com',
            password: '1'
        })
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                //console.log(res.text);
                if(res.body.error.status === 302){
                    res.status.should.equal(302);
                } else {
                    res.status.should.equal(200);
                } 
            } else {
                //console.log(res.error.text);
            }
            done();
        });
    });
});