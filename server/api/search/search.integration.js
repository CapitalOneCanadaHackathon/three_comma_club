'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newSearch;

describe('Search API:', function() {
  describe('GET /api/search', function() {
    var searchs;

    beforeEach(function(done) {
      request(app)
        .get('/api/search')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          searchs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      searchs.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/search', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/search')
        .send({
          name: 'New Search',
          info: 'This is the brand new search!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newSearch = res.body;
          done();
        });
    });

    it('should respond with the newly created search', function() {
      newSearch.name.should.equal('New Search');
      newSearch.info.should.equal('This is the brand new search!!!');
    });
  });

  describe('GET /api/search/:id', function() {
    var search;

    beforeEach(function(done) {
      request(app)
        .get(`/api/search/${newSearch._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          search = res.body;
          done();
        });
    });

    afterEach(function() {
      search = {};
    });

    it('should respond with the requested search', function() {
      search.name.should.equal('New Search');
      search.info.should.equal('This is the brand new search!!!');
    });
  });

  describe('PUT /api/search/:id', function() {
    var updatedSearch;

    beforeEach(function(done) {
      request(app)
        .put(`/api/search/${newSearch._id}`)
        .send({
          name: 'Updated Search',
          info: 'This is the updated search!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedSearch = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSearch = {};
    });

    it('should respond with the updated search', function() {
      updatedSearch.name.should.equal('Updated Search');
      updatedSearch.info.should.equal('This is the updated search!!!');
    });

    it('should respond with the updated search on a subsequent GET', function(done) {
      request(app)
        .get(`/api/search/${newSearch._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let search = res.body;

          search.name.should.equal('Updated Search');
          search.info.should.equal('This is the updated search!!!');

          done();
        });
    });
  });

  describe('PATCH /api/search/:id', function() {
    var patchedSearch;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/search/${newSearch._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Search' },
          { op: 'replace', path: '/info', value: 'This is the patched search!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedSearch = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedSearch = {};
    });

    it('should respond with the patched search', function() {
      patchedSearch.name.should.equal('Patched Search');
      patchedSearch.info.should.equal('This is the patched search!!!');
    });
  });

  describe('DELETE /api/search/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/search/${newSearch._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when search does not exist', function(done) {
      request(app)
        .delete(`/api/search/${newSearch._id}`)
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
