/**
 * Kobo model events
 */

'use strict';

import {EventEmitter} from 'events';
var KoboEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
KoboEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Kobo) {
  for(var e in events) {
    let event = events[e];
    Kobo.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    KoboEvents.emit(event + ':' + doc._id, doc);
    KoboEvents.emit(event, doc);
  };
}

export {registerEvents};
export default KoboEvents;
