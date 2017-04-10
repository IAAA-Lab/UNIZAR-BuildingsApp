/**************************************************************************
 * LoginCtrl: Controlador encargado del inicio de sesión de un usuario
 ***********************************************************************/

UZCampusWebMapApp.controller('LoginCtrl', function($scope, $rootScope, $timeout,
  $ionicLoading, $ionicPopup, $cordovaCamera, $state, infoService, photosService,
  translationService, loginService, APP_CONSTANTS){
  $scope.data = {};

  $scope.login = function() {
    loginService.postLogin($scope.data.username, $scope.data.password)
      .then(function(data) {

        // Login successful
        $state.go('app.home');
      },
      function(data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    };
});
