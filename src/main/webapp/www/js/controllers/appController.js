/**********************************************************************
 * AppCtrl: Controlador principal de la aplicación.
 ***********************************************************************/

UZCampusWebMapApp.controller('AppCtrl',function($scope, $rootScope, geoService,
  sharedProperties, $window, $state, $stateParams, $interval, $ionicSideMenuDelegate,
  loginService, changeInfoService) {

        console.log("App controller");
        $ionicSideMenuDelegate.canDragContent(true);

        var userAgent = $window.navigator.userAgent;

        $scope.provincia = "";
        $scope.refreshInterval = 5000; // 20.000 ms = 20 segundos
        $scope.numCambiosNuevos = 0;
        $scope.changesLoaded = false;

        if (loginService.checkUserLoggedIn() &&
              !$scope.changesLoaded && !changeInfoService.isCargaInicialSet()) {

          changeInfoService.loadCambiosNuevos()
            .then(function() {

              // When changes are loaded, it updates the count
              $scope.numCambiosNuevos = changeInfoService.getNumCambiosNuevos('Pendiente del usuario');
              $scope.changesLoaded = true;
              changeInfoService.setCargaInicial();
              console.log("CARGA INICIAL, SOLO 1 VEZ");
          });
        }

        // Refreshes new user pending changes to notify
        if (!changeInfoService.isIntervaloSet()) {
          changeInfoService.setIntervalo();

          $interval(function(){
            if (loginService.checkUserLoggedIn()) {

              // Solo carga nuevos cambios cuando el usuario ha iniciado una sesion
              changeInfoService.loadCambiosNuevos()
                .then(function() {
                  // console.log("CADA " + $scope.refreshInterval/1000 + " SEGUNDOS");

                  // When changes are loaded, it updates the count
                  $scope.numCambiosNuevos = changeInfoService.getNumCambiosNuevos('Pendiente del usuario');
                  // console.log("Updating user pending number of changes (" + $scope.numCambiosNuevos + ")");
              });
            }
          }, $scope.refreshInterval);
        }

        if (/firefox/i.test(userAgent)) {
            alert($scope.i18n.errors.browser_compatibility);
        }

        $scope.showSubMenu = false;

        $scope.loadMap = function(option) {
            sharedProperties.setOption(option);
            geoService.centerMap(option);
        };

        $scope.showHideSubMenu = function() {
            $scope.showSubMenu = !$scope.showSubMenu;
        };

        $scope.logout = function() {
          loginService.logout();
        };

        $scope.isUserLoggedIn = function() {
          return loginService.checkUserLoggedIn();
        };

        $scope.getCambiosNuevos = function() {
          return changeInfoService.getCambiosNuevos('Pendiente del usuario');
        };

        $scope.areCambiosNuevos = function() {
          return changeInfoService.getNumCambiosNuevos('Pendiente del usuario') > 0;
        };

        $scope.showNotifications = function() {
          // console.log($scope.isUserLoggedIn() + " - " + $scope.areCambiosNuevos());
          return $scope.isUserLoggedIn() && $scope.areCambiosNuevos();
        };
    });
