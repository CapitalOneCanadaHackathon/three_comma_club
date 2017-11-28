'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './kobo.events';

var KoboSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(KoboSchema);
export default mongoose.model('Kobo', KoboSchema);
