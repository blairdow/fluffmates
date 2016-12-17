(function() {

  angular.module('fluffMates')
         .factory('authService', authService);

  authService.$inject = ["$http", "$q", "authToken", "userDataService", "$state", "$window"];

  //||||||||||||||||||||||||||--
  // AUTH SERVICE FACTORY
  //||||||||||||||||||||||||||--
  function authService($http, $q, authToken, userDataService, $state, $window) {

    // create auth factory object
    var authFactory = {};

    // get the logged in user
    authFactory.setUser = function() {
      userDataService.user = jwt_decode(authToken.getToken())._doc;;
      return userDataService.user;
    };

    // log a user in
    authFactory.login = function(email, password) {
      // return the promise object and its data
      return $http.post('https://guarded-shelf-13715.herokuapp.com/login', {
        email: email,
        password: password
      })
        .success(function(res) {
          authToken.setToken(res.token);
          if (authFactory.isLoggedIn()){
            authFactory.setUser()
          }
          console.log(res)
          return res.token;
        });
    };

    // log a user out by clearing the token
    authFactory.logout = function() {
      // clear the token
      authToken.setToken();

      // return to login
      $state.go('login');
    };

    // check if a user is logged in
    // checks if there is a local token
    authFactory.isLoggedIn = function() {
      if (authToken.getToken())
        { return true;}
      else
        return false;
    };

    // return auth factory object
    return authFactory;
  }

})();
