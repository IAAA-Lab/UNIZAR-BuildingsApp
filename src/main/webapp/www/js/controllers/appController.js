/**********************************************************************
 * AppCtrl: Controlador principal de la aplicación.
 ***********************************************************************/

UZCampusWebMapApp.controller('AppCtrl',function($scope, $rootScope, geoService, sharedProperties, $window, $state, $stateParams) {

        var userAgent = $window.navigator.userAgent;

        $scope.provincia = "";

        if (/firefox/i.test(userAgent)) {
            alert($scope.translation.NAVEGADORNOCOMPATIBLE);
        }

        $scope.showSubMenu = false;

        $scope.loadMap = function(option, menu) {
            var currentMap = sharedProperties.getMapa();
            var currentOption = sharedProperties.getOpcion();

            if (typeof currentMap === 'undefined' || currentOption !== option) {
                sharedProperties.setOpcion(option);
                sharedProperties.setReloadMap(true);
            }
            else sharedProperties.setReloadMap(false);
            
            if (menu === true && currentOption != option) {
                geoService.centerMap(option);
            }
        };

        $scope.showHideSubMenu = function() {
            $scope.showSubMenu = !$scope.showSubMenu;
        };
    });
