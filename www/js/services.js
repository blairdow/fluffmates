(function(){
  "use strict";

    angular.module('fluffMates')
    .factory('PetsData', PetsData)

    PetsData.$inject = ['$http', '$ionicModal', 'userDataService', 'authService']

  function PetsData($http, $ionicModal, userDataService, authService) {
      var vm = {}
      vm.pets = []
      if (authService.isLoggedIn()){
        authService.setUser()
      }
      vm.chosenPets = userDataService.user.chosenPets
      vm.showPet = {}
      vm.error = ''

      vm.getPets = function(data){

        return $http.get('https://guarded-shelf-13715.herokuapp.com/pets?' + $.param(data)).then(function(response){
            vm.error = ''
            vm.pets.push(...response.data)
            console.log('service vm.pets', vm.pets)
        }, function(err){
            vm.error = "Invalid Zip Code, Try again!"

        })
      }

      vm.choosePet = function(pet, user) {
        pet.chosen = true

        var petIds = user.chosenPets.map(function(pet){
          return pet.pet_id
        })

        console.log(pet)

        var chosenPet = {
          name: pet.name.$t,
          img: pet.media.photos.photo[3].$t,
          description: pet.description.$t,
          pet_id: pet.id.$t,
          chosen: true
        }

        if(petIds.indexOf(chosenPet.pet_id) < 0){
              vm.chosenPets.push(chosenPet)
              //bump first selected pet from list if full (over three)
              if(vm.chosenPets.length > 3){
                vm.chosenPets.shift()
                }
            }

            // remove pet from list if already selected
        else if(petIds.indexOf(chosenPet.pet_id) > -1){
            vm.chosenPets.splice(vm.chosenPets.indexOf(chosenPet), 1)
        }

            user.chosenPets = vm.chosenPets

            userDataService.update(user._id, user)
            .then(function(res){
              console.log(res)
            }, function(err){
              console.log(err)
            })

      }

      return vm
    }
})()
