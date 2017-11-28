'use strict';

import angular from 'angular';
import routes from './search.routes';
import SearchController from './search.controller';

export default angular.module('devApp.search', ['ngRoute'])
  .config(routes)
  .controller('SearchController', SearchController)
  .name;
