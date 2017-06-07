// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var UZCampusWebMapApp = angular.module(
            'UZCampusWebMapApp',
            ['ionic', 'angularSlideables','ngResource','ngRoute','ngCordova',
             'angular-content-editable']
    );

UZCampusWebMapApp.run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (typeof(cordova) != 'undefined' && cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
      });
    })
    .filter("trust", ['$sce', function($sce) {
      return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
      };
    }])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/:type/:ciudad', {
            templateUrl: "templates/map.html"
        });
    }])
    .config(function($stateProvider, $urlRouterProvider, $httpProvider,
                      $ionicConfigProvider) {

      // Cuando las tabs se colocan arriba hay un bug que las oculta,
      // se ponen debajo de la nav-bar del sidemenu
      // revisar antes de descomentar: https://github.com/driftyco/ionic/issues/3288
      // $ionicConfigProvider.tabs.position('top');

      $stateProvider
          .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
          })
          .state('splash', {
            url: "/app/splash",
            templateUrl: "templates/splash.html",
            controller: 'AppCtrl'
          })
          .state('app.home', {
            url: "/home",
            template: "templates/home.html",
            controller: 'AppCtrl',
            views: {
              'menuContent':{
                templateUrl: "templates/home.html",
                controller: 'AppCtrl'
              }
            }
          })
          .state('app.search', {
            url: "/search",
            views: {
              'menuContent':{
                templateUrl: "templates/search.html",
                controller: 'SearchCtrl'
              }
            }
          })
          .state('app.searchAdvanced', {
              url: "/searchAdvanced",
              views: {
                  'menuContent':{
                      templateUrl: "templates/searchAdvanced.html",
                      controller: 'SearchCtrl'
                  }
              }
          })
          .state('app.settings', {
            url: "/settings",
            views: {
              'menuContent':{
                templateUrl: "templates/settings.html",
                controller: 'AppCtrl'
              }
            }
          })
          .state('app.login', {
            url: "/login",
            views: {
              'menuContent':{
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
              }
            }
          })
          .state('app.changes', {
            url: "/changes",
            abstract: true,
            views: {
              'menuContent':{
                templateUrl: "templates/changes.html",
                controller: 'ChangesAbstractCtrl'
              }
            }
          })
          .state('app.changes.pending', {
            url: "/pending",
            views: {
              'tab-changes-pending':{
                templateUrl: "templates/tab-changes.html",
                controller: 'ChangesCtrl'
              }
            }
          })
          .state('app.changes.waiting', {
            url: "/waiting",
            views: {
              'tab-changes-waiting':{
                templateUrl: "templates/tab-changes.html",
                controller: 'ChangesCtrl'
              }
            }
          })
          .state('app.changes.approved', {
            url: "/approved",
            views: {
              'tab-changes-approved':{
                templateUrl: "templates/tab-changes.html",
                controller: 'ChangesCtrl'
              }
            }
          })
          .state('app.changes.rejected', {
            url: "/rejected",
            views: {
              'tab-changes-rejected':{
                templateUrl: "templates/tab-changes.html",
                controller: 'ChangesCtrl'
              }
            }
          })/*
          .state('app.favs', {
            url: "/favs",
            views: {
              'menuContent':{
                templateUrl: "templates/favs.html",
                controller: 'FavsCtrl'
              }
            }
          })*/
          .state('app.floor', {
              url: "/floor",
              views: {
                  'menuContent':{
                      templateUrl: "templates/floorMap.html",
                      controller: 'FloorCtrl'
                  }
              }
          })
          .state('app.roomDetails', {
              url: "/roomDetails",
              views: {
                  'menuContent':{
                      templateUrl: "templates/roomDetails.html",
                      controller: 'RoomDetailsCtrl'
                  }
              }
          })
          .state('app.photos', {
              url: "/photos",
              views: {
                  'menuContent':{
                      templateUrl: "templates/photos.html",
                      controller: 'PhotosCtrl'
                  }
              }
          })
          .state('app.panorama', {
              url: "/panorama",
              views: {
                  'menuContent':{
                      templateUrl: "templates/panoramaView.html",
                      controller: 'PanoramaCtrl'
                  }
              }
          })
          .state('app.map', {
              url: "/map",
              template: "templates/map.html",
              controller: 'MapCtrl',
              views: {
                  'menuContent':{
                      templateUrl: "templates/map.html",
                      controller: 'MapCtrl'
                  }
              }
          });

          // if none of the above states are matched, use this as the fallback
          $urlRouterProvider.otherwise('/app/home');
          $httpProvider.interceptors.push('apiService');
    });
    /*.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/:type/:ciudad', {
                templateUrl: "templates/map.html"
            });
    }]);*/
