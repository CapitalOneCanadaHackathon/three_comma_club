'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var hubspotCtrlStub = {
  index: 'hubspotCtrl.index',
  show: 'hubspotCtrl.show',
  create: 'hubspotCtrl.create',
  upsert: 'hubspotCtrl.upsert',
  patch: 'hubspotCtrl.patch',
  destroy: 'hubspotCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var hubspotIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './hubspot.controller': hubspotCtrlStub
});

describe('Hubspot API Router:', function() {
  it('should return an express router instance', function() {
    hubspotIndex.should.equal(routerStub);
  });

  describe('GET /api/hubspot', function() {
    it('should route to hubspot.controller.index', function() {
      routerStub.get
        .withArgs('/', 'hubspotCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/hubspot/:id', function() {
    it('should route to hubspot.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'hubspotCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/hubspot', function() {
    it('should route to hubspot.controller.create', function() {
      routerStub.post
        .withArgs('/', 'hubspotCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/hubspot/:id', function() {
    it('should route to hubspot.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'hubspotCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/hubspot/:id', function() {
    it('should route to hubspot.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'hubspotCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/hubspot/:id', function() {
    it('should route to hubspot.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'hubspotCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
