import angular from 'angular';
const ngRoute = require('angular-route');
import routing from './main.routes';

export class MainController {
  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
    this.forms = '';
    this.showLoading = false;
    this.showLoadingId = '';
    this.doneSync = false;
    this.formIds = [];

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/kobo/form')
      .then(response => {
        this.forms = response.data;
        for(var x=0; x<this.forms.length;x++){
          this.formIds.push(this.forms[x].id);
        }
        console.log(this.formIds);
      });
  }

  addThing() {
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  sync(id) {
    this.showLoading = true;
    this.showLoadingId = id;
    this.doneSync = false;
    var that = this;
    this.$http.get('/api/kobo/form/' + id)
      .then(response => {
        console.log(response.data);
        this.$http.post('/api/hubspot/properties', response.data).then(function(data) {
          console.log(data);
          that.showLoading = false;
          that.doneSync = true;
        });
      });
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }
}

export default angular.module('devApp.main', [ngRoute])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
