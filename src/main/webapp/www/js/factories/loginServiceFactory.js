UZCampusWebMapApp.factory('loginService', function($q, $http, APP_CONSTANTS){

    var postLogin = function(username, password) {

      var deferred = $q.defer();
      var credentials = {"username":username,"password":password};

      $http({
        method: 'POST',
        url: APP_CONSTANTS.URI_API + 'login',
        data: JSON.stringify(credentials),
        headers: {'Content-Type':'application/json'}
      }).success(function(res,status,headers,config) {

          // Stores token without 'Bearer' prefix in localStorage
          var token =  headers('Authorization');

          // Deletes 'Bearer ' if there is one
          if (token.startsWith("Bearer ")) {
            token = token.substring(7,token.length);
          }

          localStorage.setItem('access-token', token);
          deferred.resolve(res);
      }).
      error(function(err) {
          console.log("Error in login");
          deferred.reject(err);
      });
      return deferred.promise;
    };

    var checkUserLoggedIn = function() {
      return (localStorage.getItem('access-token') !== null);
    };

    // Removes the token so the user is not logged in anymore
    var logout = function() {
      localStorage.removeItem('access-token');
    };

    var getUserInfo = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: APP_CONSTANTS.URI_API + 'users/info'
      }).success(function(res) {
          deferred.resolve(res);
      }).
      error(function(err) {
          console.log("Error while obtaining user info");
          deferred.reject(err);
      });
      return deferred.promise;
    };

    return ({
      postLogin: postLogin,
      logout: logout,
      checkUserLoggedIn: checkUserLoggedIn,
      getUserInfo: getUserInfo
    });

});
