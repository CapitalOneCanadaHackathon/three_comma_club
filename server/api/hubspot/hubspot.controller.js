/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Hubspot              ->  index
 * POST    /api/Hubspot              ->  create
 * GET     /api/Hubspot/:id          ->  show
 * PUT     /api/Hubspot/:id          ->  upsert
 * PATCH   /api/Hubspot/:id          ->  patch
 * DELETE  /api/Hubspot/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Hubspot from './hubspot.model';

const slug = require('slug');
const HubspotLib = require('hubspot');
const Promise = require('bluebird');
const rp = require('request-promise');

const hubAPIKey = 'c797a138-7e4f-4a8f-9827-e0af10c77312';
const hubspot = new HubspotLib({
  apiKey: hubAPIKey
});

const KOBO_FT_IGNORE = [
  '__version__',
  'meta',
  'start',
  'end',
  'formhub/uuid',
  'meta/instanceid',
]

// store type, fieldType
const KOBO_FT_HUBSPOT_FT = {
  'text': ['string', 'text'],
  'select one': ['enumeration', 'select'],
  'number': ['number', 'number'],
};


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
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
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
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

// Gets a list of Hubspots
export function index(req, res) {
  return hubspot.contacts.get({})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Hubspot from the DB
export function show(req, res) {
  return Hubspot.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Hubspot in the DB
export function createContacts(req, res) {
  let userDataList = req.body;
  let listOfProperties = [];
  let trueObject = Object.assign({}, ...userDataList);
  let filteredObject = Object.keys(trueObject)
    .filter((key) => {
      console.log("key = ", key);
      key = key.toLowerCase();
      return !KOBO_FT_IGNORE.includes(key) && !key.startsWith('_');
    })
    .reduce((obj, key) => {
      obj[key] = trueObject[key];
      return obj;
    }, {});
  console.log(filteredObject)

  let properties = [];
  for (let key of Object.keys(filteredObject)) {
    let slugKey = key.toLowerCase();
    properties.push({
        'property': slugKey,
        'value': filteredObject[key]
    })
  }
  properties.push({
    property: 'firstname',
    value: filteredObject['Instagram_Handle_no_']
  })

 let payload = {
   'properties': properties
 }
console.log(payload)

  return rp({
      method: 'POST',
      json: true,
      uri: `https://api.hubapi.com/contacts/v1/contact/?hapikey=${hubAPIKey}`,
      body: payload
    })
    .catch((err) => {
      if (err.statusCode === 409) {
        console.log("already exists, ignore");
        return "ignored group";
      } else {
        throw err;
      }
    })
    .then((body) => {
      console.log("response after group = ", body);
      return res.status(201).json(body);
    })
    .catch(handleError(res));
}

// Creates a new Hubspot in the DB
export function createProperties(req, res) {
  let contactPropertyGroupName = req.body.title;
  let contactProperties = req.body.children;
  let listOfProperties = [];
  let slugContactPropertyGroupName = slug(contactPropertyGroupName).toLowerCase()
  let filteredContactProperties = contactProperties.filter((contact) => {
    return !(KOBO_FT_IGNORE.indexOf(contact.name) > -1);
  });

  let contactPropertyGroupNamePayload = {
    'displayName': contactPropertyGroupName,
    'name': slugContactPropertyGroupName
  }

  filteredContactProperties.map((child) => {
    let options = [];
    let hsType = KOBO_FT_HUBSPOT_FT[child.type][0];
    let hsFieldType = KOBO_FT_HUBSPOT_FT[child.type][1];
    let slugChildName = slug(child.name).toLowerCase();

    if (hsType === 'enumeration') {
      child.children.map((option) => {
        options.push({
          'label': option.label,
          'value': option.name
        })
      })
    }

    listOfProperties.push({
      'groupName': slugContactPropertyGroupName,
      'name': slugChildName,
      'label': child.label,
      'type': hsType,
      'fieldType': hsFieldType,
      'options': options,
    })
  })

  let propertyPromise = [];
  listOfProperties.map((property) => {
    propertyPromise.push(
      rp({
        method: 'POST',
        json: true,
        uri: `https://api.hubapi.com/properties/v1/contacts/properties?hapikey=${hubAPIKey}`,
        body: property
      }).catch((err) => {
        if (err.statusCode === 409) {
          console.log("property already exists, ignore");
          return "ignored property";
        } else {
          throw err;
        }
      })
    )
  })

  return rp({
      method: 'POST',
      json: true,
      uri: `https://api.hubapi.com/properties/v1/contacts/groups?hapikey=${hubAPIKey}`,
      body: contactPropertyGroupNamePayload
    })
    .catch((err) => {
      if (err.statusCode === 409) {
        console.log("already exists, ignore");
        return "ignored group";
      } else {
        throw err;
      }
    })
    .then((body) => {
      console.log("response after group = ", body);
      return Promise.all(propertyPromise);
    })
    .then((body) => {
      console.log("response after properties = ", body);
      return res.status(201).json(body);
    })
    .catch(handleError(res));
}

// Upserts the given Hubspot in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Hubspot.findOneAndUpdate({
      _id: req.params.id
    }, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Hubspot in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Hubspot.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Hubspot from the DB
export function destroy(req, res) {
  return Hubspot.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
