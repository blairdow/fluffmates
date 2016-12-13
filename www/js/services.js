(function(){
  "use strict";

    angular.module('fluffMates')
    .factory('PetsData', PetsData)

    PetsData.$inject = ['$http']

  function PetsData($http) {
      var vm = this
      vm.pets = []

      vm.getPets = function(data){
        console.log('clicked')

        $http.get('http://localhost:3000/pets?' + $.param(data)).then(function(response){
            // vm.pets.length = 0
            vm.pets.push(...response.data)
            console.log('service vm.pets', vm.pets)
        }, function(err){
            console.log(err)
        })
      }

      vm.chosenPets = []

      var service = {
        pets: vm.pets,
        getPets: vm.getPets,
        chosenPets: vm.chosenPets
      }

      return service
    }
})()
