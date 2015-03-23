var hippie = require('hippie');
var nock = require('nock');
var proxyquire = require('proxyquire').noPreserveCache();
var MockFirebase = require('mockfirebase').MockFirebase;
var expect = require('chai').expect;

var fireRef;
var firebaseStub = function (url) {
  fireRef = new MockFirebase(url)
  fireRef.autoFlush();
  return fireRef;
}

firebaseStub['@global'] = true;

var app = proxyquire('../app', {
  'firebase': firebaseStub
});

describe('/scraper endpoint', function () {
  var resFn = function(done, err, res, body) {
    if (err) throw err;
    done();
  };

  beforeEach(function() {
    // allow localhost requests
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');

    nock('http://example.com')
      .get('/Backend-Apps-with-Webpack--Part-I')
      .replyWithFile(200, __dirname + '/replies/Backend-Apps-with-Webpack--Part-I.html')
  });

  describe('GET', function () {
    describe('[json]', function() {
      var request;

      beforeEach(function() {
        request = hippie(app)
          .json()
          .get('/scraper?url=http://example.com/Backend-Apps-with-Webpack--Part-I');
      });

      it('responds with 200', function(done) {
        request
          .expectStatus(200)
          .end(resFn.bind(null, done));
      });

      it('returns url', function(done) {
        request
          .expectValue('url', 'http://example.com/Backend-Apps-with-Webpack--Part-I')
          .end(resFn.bind(null, done));
      });

      it('returns title', function(done) {
        request
          .expectValue('title', 'Backend Apps with Webpack: Part I')
          .end(resFn.bind(null, done));
      });

      it('returns content', function(done) {
        request
          .expectValue('content', /the style of its documentation and APIs are not my favorite/)
          .end(resFn.bind(null, done));
      });
    });

    describe('[jsonp]', function() {
      it('wraps result in a function', function(done) {
        request = hippie(app)
          .get('/scraper?url=http://example.com/Backend-Apps-with-Webpack--Part-I&callback=rofl')
          .expectBody(/^\/\*\*\/ typeof rofl === 'function' && rofl\({.*}\);$/)
          .end(resFn.bind(null, done));
      });
    });
  });

  describe('POST', function() {
    var request;

    beforeEach(function() {
      request = hippie(app)
        .form()
        .post('/scraper')
        .send({ url: 'http://example.com/Backend-Apps-with-Webpack--Part-I' });
    });

    it('responds with 200', function(done) {
      request
        .expectStatus(200)
        .end(resFn.bind(null, done));
    });

    it('accepts requests from another domains', function(done) {
      request
        .expectHeader('access-control-allow-origin', '*')
        .end(resFn.bind(null, done));
    });

    it('puts data into firebase', function(done) {
      request
        .expect(function(res, body, next) {
          var articlesRef = fireRef.child('articles');
          var data = articlesRef.getData()[articlesRef._lastAutoId];

          expect(data.title).to.equal('Backend Apps with Webpack: Part I');
          expect(data.url).to.equal('http://example.com/Backend-Apps-with-Webpack--Part-I');
          expect(data.content).to.match(/the style of its documentation and APIs are not my favorite/);

          next();
        })
        .end(resFn.bind(null, done));
    });

    it('responds with 400 if url wasnt provided', function(done) {
      hippie(app)
        .form()
        .post('/scraper')
        .expectStatus(400)
        .end(resFn.bind(null, done));
    });

    it('responds with 500 if url is malformed', function(done) {
      hippie(app)
        .form()
        .post('/scraper')
        .send({ url: '.com/Backend-Apps-with-Webpack--Part-I' })
        .expectStatus(500)
        .end(resFn.bind(null, done));
    });
  });
});
