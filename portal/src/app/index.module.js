/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { HomeController } from './home/home.controller';
import { ThemeMainDirective, PageScroll } from '../app/components/theme-main/themeMain.directive';

angular.module('wiperrPortal', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'mgo-angular-wizard', 'lbServices',
  'ngMessages', 'ngAria', 'ngResource', 'toastr', 'ui.router', 'datePicker', 'ui.bootstrap', 'moment-picker'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .controller('HomeController', HomeController)
  .directive('themeMain', ThemeMainDirective)
  .directive('pageScroll', PageScroll);
