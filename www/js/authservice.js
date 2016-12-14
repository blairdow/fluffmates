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

    // log a user in
    authFactory.login = function(email, password) {

      // return the promise object and its data
      return $http.post('http://localhost:3000/login', {
        email: email,
        password: password
      })
        .success(function(res) {
          console.log('authservice', res)
          authToken.setToken(res.token);
          authFactory.setUser()

          console.log("check it out", userDataService.user);
          return res.token;
        });
    };

    // log a user out by clearing the token
    authFactory.logout = function() {
      // clear the token
      authToken.setToken();

      // return to homepage
      $state.go('tab.account');
    };

    // check if a user is logged in
    // checks if there is a local token
    authFactory.isLoggedIn = function() {
      if (authToken.getToken())
        return true;
      else
        return false;
    };

    // get the logged in user
    authFactory.setUser = function() {
      var token = authToken.getToken().split('.')[1];
      var user = JSON.parse($window.atob(token))._doc;
      console.log('set user function', user)
      userDataService.user = user;
      console.log(userDataService.user)
      return user;
    };

    // return auth factory object
    return authFactory;
  }

})();
