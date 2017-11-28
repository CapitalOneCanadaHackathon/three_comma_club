'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var searchCtrlStub = {
  index: 'searchCtrl.index',
  show: 'searchCtrl.show',
  create: 'searchCtrl.create',
  upsert: 'searchCtrl.upsert',
  patch: 'searchCtrl.patch',
  destroy: 'searchCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var searchIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './search.controller': searchCtrlStub
});

describe('Search API Router:', function() {
  it('should return an express router instance', function() {
    searchIndex.should.equal(routerStub);
  });

  describe('GET /api/search', function() {
    it('should route to search.controller.index', function() {
      routerStub.get
        .withArgs('/', 'searchCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/search/:id', function() {
    it('should route to search.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'searchCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/search', function() {
    it('should route to search.controller.create', function() {
      routerStub.post
        .withArgs('/', 'searchCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/search/:id', function() {
    it('should route to search.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'searchCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/search/:id', function() {
    it('should route to search.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'searchCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/search/:id', function() {
    it('should route to search.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'searchCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
