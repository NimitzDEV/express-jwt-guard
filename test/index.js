const request = require('supertest');

describe('Guarding test', function() {
  let server = null;
  let issuer = null;
  let secret = 'GUARD';

  before(function() {
    server = require('./server').server;
    issuer = require('./server').sign;
  });

  after(function() {
    server.close();
  });

  // TEST SINGLE PERMISSION ON SINGLE METHOD
  it('APP LEVEL: GET /getonly with permission ADMIN should get 200', function(done) {
    request(server)
      .get('/getonly')
      .set('JWT', issuer({ permissions: ['ADMIN'] }))
      .expect(200, done);
  });

  it('APP LEVEL: GET /getonly with permission STUDENT should get 403', function(done) {
    request(server)
      .get('/getonly')
      .set('JWT', issuer({ permissions: ['STUDENT'] }))
      .expect(403, done);
  });

  it('APP LEVEL: GET /getonly without token should get 401', function(done) {
    request(server)
      .get('/getonly')
      .expect(401, done);
  });

  it('APP LEVEL: POST /getonly without token should get 200', function(done) {
    request(server)
      .post('/getonly')
      .expect(200, done);
  });

  // TEST SINGLE PERMISSION ON ALL METHODS
  it('APP LEVEL: GET /allmethods with permission ADMIN should get 200', function(done) {
    request(server)
      .get('/allmethods')
      .set('JWT', issuer({ permissions: ['ADMIN'] }))
      .expect(200, done);
  });

  it('APP LEVEL: POST /allmethods with permission ADMIN should get 200', function(done) {
    request(server)
      .get('/allmethods')
      .set('JWT', issuer({ permissions: ['ADMIN'] }))
      .expect(200, done);
  });

  it('APP LEVEL: GET /allmethods without permission should get 401', function(done) {
    request(server)
      .get('/allmethods')
      .expect(401, done);
  });

  // TEST MULTIPLE PERMISSIONS ON GET METHODS
  it('APP LEVEL: GET /require2perms with permission ADMIN and CFG:W should get 200', function(done) {
    request(server)
      .get('/require2perms')
      .set('JWT', issuer({ permissions: ['ADMIN', 'CFG:W'] }))
      .expect(200, done);
  });

  it('APP LEVEL: GET /require2perms with permission ADMIN and CFG:R should get 403', function(done) {
    request(server)
      .get('/require2perms')
      .set('JWT', issuer({ permissions: ['ADMIN', 'CFG:R'] }))
      .expect(403, done);
  });

  it('APP LEVEL: GET /require2perms with permission ADMIN only should get 403', function(done) {
    request(server)
      .get('/require2perms')
      .set('JWT', issuer({ permissions: ['ADMIN'] }))
      .expect(403, done);
  });

  it('APP LEVEL: GET /require2perms with permission ADMIM CFG:W CFG:R should get 200', function(done) {
    request(server)
      .get('/require2perms')
      .set('JWT', issuer({ permissions: ['ADMIN', 'CFG:W', 'CFG:R'] }))
      .expect(200, done);
  });

  // Router Level
  it('ROUTER LEVEL: GET /route/user/123 without permission should get 401', function(done) {
    request(server)
      .get('/route/user/123')
      .expect(401, done);
  });

  it('ROUTER LEVEL: GET /route/user/123 with permission ADMIN should get 200', function(done) {
    request(server)
      .get('/route/user/123')
      .set('JWT', issuer({ permissions: ['ADMIN'] }))
      .expect(200, done);
  });
});
