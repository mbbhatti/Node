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

describe("Product", function() {

    it("all default", function(done) {
        server
        .get('/products')
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("all with page number", function(done) {
        server
        .get('/products?page=1')
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("all with page and limit", function(done) {
        server
        .get('/products?page=1&limit=5')
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("all with page, limit and description length", function(done) {
        server
        .get('/products?page=1&limit=3&description_length=10')
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Search without query string", function(done) {
        server
        .get('/products/search')
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Search with query string", function(done) {
        server
        .get('/products/search?query_string=italian')
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Search with query string and page", function(done) {
        server
        .get('/products/search?query_string=italian&page=1')
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Search with query string, page and limit", function(done) {
        server
        .get('/products/search?query_string=italian&page=1&limit=2')
        .expect("Content-type", /x-www-form-urlencoded/)
        .expect(200)
        .end(function(err, res) {
            if (res.error === false) {
                res.status.should.equal(200);
            }
            done();
        });
    });

    it("Search with query string, page, limit and description length", function(done) {
        server
        .get('/products/search?query_string=italian&page=1&limit=2&description_length=5')
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