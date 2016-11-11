/**********************************************************************
 * AppCtrl: Controlador principal de la aplicación.
 ***********************************************************************/

UZCampusWebMapApp.controller('AppCtrl',function($scope, $rootScope, geoService, sharedProperties, $window, $state, $stateParams) {

        var userAgent = $window.navigator.userAgent;

        $scope.provincia = "";

        if (/firefox/i.test(userAgent)) {
            alert($scope.i18n.errors.browser_compatibility);
        }

        $scope.showSubMenu = false;

        $scope.loadMap = function(option, menu) {
            var currentMap = sharedProperties.getMap();
            var currentOption = sharedProperties.getOption();
            
            if (menu === true) {
                geoService.centerMap(option);
            }
        };

        $scope.showHideSubMenu = function() {
            $scope.showSubMenu = !$scope.showSubMenu;
        };
    });
