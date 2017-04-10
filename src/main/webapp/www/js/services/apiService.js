UZCampusWebMapApp.service('apiService', function(){

  this.request = function(config) {
    var token = localStorage.getItem('access-token');
    if (token !== null) {
      console.log("TOKEN AÑADIDO A LA REQUEST");
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  };
});
