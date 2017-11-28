'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newHubspot;

describe('Hubspot API:', function() {
  describe('GET /api/hubspot', function() {
    var hubspots;

    beforeEach(function(done) {
      request(app)
        .get('/api/hubspot')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          hubspots = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      hubspots.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/hubspot', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/hubspot')
        .send({
          name: 'New Hubspot',
          info: 'This is the brand new hubspot!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newHubspot = res.body;
          done();
        });
    });

    it('should respond with the newly created hubspot', function() {
      newHubspot.name.should.equal('New Hubspot');
      newHubspot.info.should.equal('This is the brand new hubspot!!!');
    });
  });

  describe('GET /api/hubspot/:id', function() {
    var hubspot;

    beforeEach(function(done) {
      request(app)
        .get(`/api/hubspot/${newHubspot._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          hubspot = res.body;
          done();
        });
    });

    afterEach(function() {
      hubspot = {};
    });

    it('should respond with the requested hubspot', function() {
      hubspot.name.should.equal('New Hubspot');
      hubspot.info.should.equal('This is the brand new hubspot!!!');
    });
  });

  describe('PUT /api/hubspot/:id', function() {
    var updatedHubspot;

    beforeEach(function(done) {
      request(app)
        .put(`/api/hubspot/${newHubspot._id}`)
        .send({
          name: 'Updated Hubspot',
          info: 'This is the updated hubspot!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedHubspot = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedHubspot = {};
    });

    it('should respond with the updated hubspot', function() {
      updatedHubspot.name.should.equal('Updated Hubspot');
      updatedHubspot.info.should.equal('This is the updated hubspot!!!');
    });

    it('should respond with the updated hubspot on a subsequent GET', function(done) {
      request(app)
        .get(`/api/hubspot/${newHubspot._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let hubspot = res.body;

          hubspot.name.should.equal('Updated Hubspot');
          hubspot.info.should.equal('This is the updated hubspot!!!');

          done();
        });
    });
  });

  describe('PATCH /api/hubspot/:id', function() {
    var patchedHubspot;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/hubspot/${newHubspot._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Hubspot' },
          { op: 'replace', path: '/info', value: 'This is the patched hubspot!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedHubspot = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedHubspot = {};
    });

    it('should respond with the patched hubspot', function() {
      patchedHubspot.name.should.equal('Patched Hubspot');
      patchedHubspot.info.should.equal('This is the patched hubspot!!!');
    });
  });

  describe('DELETE /api/hubspot/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/hubspot/${newHubspot._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when hubspot does not exist', function(done) {
      request(app)
        .delete(`/api/hubspot/${newHubspot._id}`)
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
