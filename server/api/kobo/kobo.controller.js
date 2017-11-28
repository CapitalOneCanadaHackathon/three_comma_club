/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/kobo              ->  index
 * POST    /api/kobo              ->  create
 * GET     /api/kobo/:id          ->  show
 * PUT     /api/kobo/:id          ->  upsert
 * PATCH   /api/kobo/:id          ->  patch
 * DELETE  /api/kobo/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Kobo from './kobo.model';
var request = require('request');
const Promise = require('bluebird');
const rp = require('request-promise');
var token = '4504d720c0a8273d8f9102e0456bfc85a77e6a0c';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Kobos
export function index(req, res) {
  return Kobo.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getForms(req, res){
  var options = {
    url: 'https://kc.kobotoolbox.org/api/v1/data',
    headers: {
      'Authorization': 'Token ' + token
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.status('200').json(info);
    }
  }
   
  request(options, callback);
}

export function getFormById(req, res){
  var options = {
    url: 'https://kc.kobotoolbox.org/api/v1/forms/' + req.params.id + '/form',
    headers: {
      'Authorization': 'Token ' + token
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.status('200').json(info);
    }
  }
   
  request(options, callback);
}

export function getFormData(req, res){
  var options = {
    url: 'https://kc.kobotoolbox.org/api/v1/data/' + req.params.id,
    headers: {
      'Authorization': 'Token ' + token
    }
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      res.status('200').json(info);
    }
  }
   
  request(options, callback);
}

export function getAggregatedData(req, res){
  var ids = req.body.ids;
  var urls = [];
  
  let propertyPromise = [];
  ids.map((id) => {
    propertyPromise.push(
      rp({
        method: 'GET',
        json: true,
        uri: 'https://kc.kobotoolbox.org/api/v1/data/' + id,
        headers: {
        'Authorization': 'Token ' + token
      }
      })
    )
  })

  Promise.all(propertyPromise).then(function(data){
    var final = [];
    for(var x=0; x<data.length;x++){
      for(var y=0; y<data[x].length;y++){
        final.push(data[x][y]);
      }
    }
    return res.status('200').json(final.filter(item =>{
      if(item['Instagram_Handle_no_']){
        item['Instagram_Handle_no_'] = item['Instagram_Handle_no_'].toLowerCase();
      }
      return item['Instagram_Handle_no_'] === req.body.query.toLowerCase()
    }));
  });
}

/*
export function getAggregatedData(req, res){
  var ids = [137721,137719];
  var formData = [];
  var fn = function getData(data){
    var options = {
    url: 'https://kc.kobotoolbox.org/api/v1/data/' + data,
      headers: {
        'Authorization': 'Token ' + token
      }
    };
    return new Promise(function(resolve) {
      request(options, callback);
      resolve('test');
    })
  }

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info);
      formData.push(info);
    }
  }
  var actions = ids.map(fn);
  var results = Promise.all(actions);
  results.then(function(data){
    res.status('200').json(formData);
  })

  
}
*/

// Gets a single Kobo from the DB
export function show(req, res) {
  return Kobo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Kobo in the DB
export function create(req, res) {
  return Kobo.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Kobo in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Kobo.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Kobo in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Kobo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Kobo from the DB
export function destroy(req, res) {
  return Kobo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
