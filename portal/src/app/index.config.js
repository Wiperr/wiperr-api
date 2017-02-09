export function config ($logProvider, toastrConfig) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);

  angular.extend(toastrConfig, {
    positionClass: 'toast-top-center',
    target: 'body'
  });
}
