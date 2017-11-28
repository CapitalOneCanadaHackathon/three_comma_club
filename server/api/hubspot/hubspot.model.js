'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './hubspot.events';

var HubspotSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(HubspotSchema);
export default mongoose.model('Hubspot', HubspotSchema);
