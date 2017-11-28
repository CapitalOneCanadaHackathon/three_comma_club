'use strict';

import angular from 'angular';
import SignupController from './signup.controller';

export default angular.module('devApp.signup', [])
  .controller('SignupController', SignupController)
  .name;
