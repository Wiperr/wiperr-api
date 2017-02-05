export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/home/home.html',
      controller: 'HomeController',
      controllerAs: 'home',
      resolve: {
        $services: (Service) => {
          'ngInject';
          return Service.find().$promise;
        }
      }
    });

  $urlRouterProvider.otherwise('/');
}
