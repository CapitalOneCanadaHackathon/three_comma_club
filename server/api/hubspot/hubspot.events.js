/**
 * Hubspot model events
 */

'use strict';

import {EventEmitter} from 'events';
var HubspotEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
HubspotEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Hubspot) {
  for(var e in events) {
    let event = events[e];
    Hubspot.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    HubspotEvents.emit(event + ':' + doc._id, doc);
    HubspotEvents.emit(event, doc);
  };
}

export {registerEvents};
export default HubspotEvents;
