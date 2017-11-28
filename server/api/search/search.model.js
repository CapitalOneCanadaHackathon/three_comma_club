'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './search.events';

var SearchSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(SearchSchema);
export default mongoose.model('Search', SearchSchema);
