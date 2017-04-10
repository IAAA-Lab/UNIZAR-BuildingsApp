UZCampusWebMapApp.service('apiService', function(){

  this.request = function(config) {
    var token = localStorage.getItem('access-token');
    if (token !== null) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  };
});
