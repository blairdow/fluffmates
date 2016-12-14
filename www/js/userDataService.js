(function() {
  "use strict";

  angular
    .module("fluffMates")
    .factory("userDataService", userDataService);

  userDataService.$inject = ['$http'];

  function userDataService($http) {
    var userFactory = {
      user: {}
    }

//    // create a user
//    userFactory.create = function(userData) {
//      return $http.post('/api/users/', userData);
//    };
//
//    // update a user
//    userFactory.update = function(id, userData) {
//      return $http.put('/api/users/' + id, userData);
//    };
//
//    // delete a user
//    userFactory.delete = function(id) {
//      return $http.delete('/api/users/' + id);
//    };

    // return our entire userFactory object
    return userFactory;
  }

})()
