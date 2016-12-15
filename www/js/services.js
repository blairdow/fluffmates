(function(){
  "use strict";

    angular.module('fluffMates')
    .factory('PetsData', PetsData)

    PetsData.$inject = ['$http', '$ionicModal', 'userDataService']

  function PetsData($http, $ionicModal, userDataService) {
      var vm = this
      vm.pets = []
      vm.chosenPets = []
      vm.showPet = {}

      vm.getPets = function(data){

        $http.get('http://localhost:3000/pets?' + $.param(data)).then(function(response){
            vm.pets.push(...response.data)
            console.log('service vm.pets', vm.pets)
        }, function(err){
            console.log(err)
        })
      }

      vm.choosePet = function(pet, user) {
        console.log('pet data user', user)
        if(vm.chosenPets.indexOf(pet) < 0){
              pet.chosen = true
              vm.chosenPets.push(pet)

              //bump first selected pet from list if full (over three)
              if(vm.chosenPets.length > 3){
                var removed = vm.chosenPets.shift()
                removed.chosen = false
                pet.chosen = true
                console.log('removed', removed)
              }
            }

            // remove pet from list if already selected
            else if(vm.chosenPets.indexOf(pet) > -1){
                pet.chosen = false
                vm.chosenPets.splice(vm.chosenPets.indexOf(pet), 1)
            }

            userDataService.update(user._id, user)
            .then(function(res){
              console.log(res)
            })

      }

      var service = {
        pets: vm.pets,
        getPets: vm.getPets,
        choosePet: vm.choosePet,
        chosenPets: vm.chosenPets,
      }

      return service
    }
})()
