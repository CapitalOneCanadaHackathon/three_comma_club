'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/search', {
    template: require('./search.html'),
    controller: 'SearchController',
    controllerAs: 'vm'
  });
}
