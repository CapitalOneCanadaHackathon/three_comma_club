'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newKobo;

describe('Kobo API:', function() {
  describe('GET /api/kobo', function() {
    var kobos;

    beforeEach(function(done) {
      request(app)
        .get('/api/kobo')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          kobos = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      kobos.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/kobo', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/kobo')
        .send({
          name: 'New Kobo',
          info: 'This is the brand new kobo!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newKobo = res.body;
          done();
        });
    });

    it('should respond with the newly created kobo', function() {
      newKobo.name.should.equal('New Kobo');
      newKobo.info.should.equal('This is the brand new kobo!!!');
    });
  });

  describe('GET /api/kobo/:id', function() {
    var kobo;

    beforeEach(function(done) {
      request(app)
        .get(`/api/kobo/${newKobo._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          kobo = res.body;
          done();
        });
    });

    afterEach(function() {
      kobo = {};
    });

    it('should respond with the requested kobo', function() {
      kobo.name.should.equal('New Kobo');
      kobo.info.should.equal('This is the brand new kobo!!!');
    });
  });

  describe('PUT /api/kobo/:id', function() {
    var updatedKobo;

    beforeEach(function(done) {
      request(app)
        .put(`/api/kobo/${newKobo._id}`)
        .send({
          name: 'Updated Kobo',
          info: 'This is the updated kobo!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedKobo = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedKobo = {};
    });

    it('should respond with the updated kobo', function() {
      updatedKobo.name.should.equal('Updated Kobo');
      updatedKobo.info.should.equal('This is the updated kobo!!!');
    });

    it('should respond with the updated kobo on a subsequent GET', function(done) {
      request(app)
        .get(`/api/kobo/${newKobo._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let kobo = res.body;

          kobo.name.should.equal('Updated Kobo');
          kobo.info.should.equal('This is the updated kobo!!!');

          done();
        });
    });
  });

  describe('PATCH /api/kobo/:id', function() {
    var patchedKobo;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/kobo/${newKobo._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Kobo' },
          { op: 'replace', path: '/info', value: 'This is the patched kobo!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedKobo = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedKobo = {};
    });

    it('should respond with the patched kobo', function() {
      patchedKobo.name.should.equal('Patched Kobo');
      patchedKobo.info.should.equal('This is the patched kobo!!!');
    });
  });

  describe('DELETE /api/kobo/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/kobo/${newKobo._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when kobo does not exist', function(done) {
      request(app)
        .delete(`/api/kobo/${newKobo._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
