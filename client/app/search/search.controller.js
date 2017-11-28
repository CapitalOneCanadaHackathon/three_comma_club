'use strict';

export default class SearchController {

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
    this.query = '';
    this.formIds = [];
    this.for

    this.$http.get('/api/kobo/form')
      .then(response => {
        this.forms = response.data;
        for(var x=0; x<this.forms.length;x++){
          this.formIds.push(this.forms[x].id);
        }
        console.log(this.formIds);
      });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  createContact(){
    this.$http.post('/api/hubspot/contacts', this.foundUsers).then(function(data) {
      console.log(data);
    });
  }

  searchUser() {
    this.$http.post('/api/kobo/aggregated', {ids: this.formIds, query:this.query})
      .then(response => {
        this.foundUsers = response.data;
        console.log(response.data);
      });
  }
}
