'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var koboCtrlStub = {
  index: 'koboCtrl.index',
  show: 'koboCtrl.show',
  create: 'koboCtrl.create',
  upsert: 'koboCtrl.upsert',
  patch: 'koboCtrl.patch',
  destroy: 'koboCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var koboIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './kobo.controller': koboCtrlStub
});

describe('Kobo API Router:', function() {
  it('should return an express router instance', function() {
    koboIndex.should.equal(routerStub);
  });

  describe('GET /api/kobo', function() {
    it('should route to kobo.controller.index', function() {
      routerStub.get
        .withArgs('/', 'koboCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/kobo/:id', function() {
    it('should route to kobo.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'koboCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/kobo', function() {
    it('should route to kobo.controller.create', function() {
      routerStub.post
        .withArgs('/', 'koboCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/kobo/:id', function() {
    it('should route to kobo.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'koboCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/kobo/:id', function() {
    it('should route to kobo.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'koboCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/kobo/:id', function() {
    it('should route to kobo.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'koboCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
