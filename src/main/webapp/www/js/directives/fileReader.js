UZCampusWebMapApp.directive('ngFileSelect', function($q, fileReader) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.bind('change', function(e) {
        scope.file = (e.srcElement || e.target).files[0];

        // Reads the image as URL so it can be showed in html
        fileReader.readAsDataURL(scope.file, scope)
          .then(function(result) {

            // Calls a method to resize preview image
            scope.setPreview(result);
          });
      });
    }
  };
});
