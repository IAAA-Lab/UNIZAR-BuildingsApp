UZCampusWebMapApp.directive('formAddNotification', function($ionicLoading) {
  return {
    restrict : 'A',
    scope: true,
    controller : function($scope) {
      $scope.submit = function(data) {
        console.log("Submit form add notification",data);
        if($scope.addNotificationform.$valid) {
          $scope.confirmCreateNotification($scope.data, $scope.addNotificationform);
        } else {
          if (!data.hasOwnProperty('comments')) $('.comments-error').show();
          $ionicLoading.show({ template: $scope.i18n.loading_mask.invalid_form, duration: 1500});
        }
      };
    }
  };
});
