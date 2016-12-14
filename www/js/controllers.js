(function(){
     angular.module('fluffMates')
        .controller('PetsCtrl', PetsCtrl)
        .controller('AccountCtrl', AccountCtrl)
        .controller('SearchCtrl', SearchCtrl)


    PetsCtrl.$inject = ['$http', 'PetsData', '$ionicModal', '$scope']
    AccountCtrl.$inject = ['PetsData']
    SearchCtrl.$inject = ['PetsData', '$state']

    function PetsCtrl($http, PetsData, $ionicModal, $scope) {
        var vm = this
        vm.pets = PetsData.pets
        vm.showPet = {}

        vm.choosePet = function(pet){
            //add pet to list if not already on it
            if(PetsData.chosenPets.indexOf(pet) < 0){
              pet.chosen = true
              PetsData.chosenPets.push(pet)

              //bump first selected pet from list if full (over three)
              if(PetsData.chosenPets.length > 3){
                var removed = PetsData.chosenPets.shift()
                removed.chosen = false
                pet.chosen = true
                console.log('removed', removed)
              }
            }
            
            // remove pet from list if already selected
            else if(PetsData.chosenPets.indexOf(pet) > -1){ 
                pet.chosen = false
                PetsData.chosenPets.splice(PetsData.chosenPets.indexOf(pet), 1)
            }
            console.log('chosen pets', PetsData.chosenPets)
        }

        vm.showPetInfo = function(pet){
          vm.showPet = pet
          console.log(vm.showPet)
          
          if(vm.modal) {vm.modal.remove()}
          
          $ionicModal.fromTemplateUrl('./templates/pet-show-modal.html', {
              scope: $scope,
              animation: 'slide-in-up'
          })
          .then(function(modal){
              vm.modal = modal
              vm.modal.show()
          })
        }
        
        vm.closeModal = function(){
            vm.modal.hide()
        }
    }

    function AccountCtrl () {
        var vm = this

        vm.settings = {
            enableFriends: true
        }
    }

    function SearchCtrl (PetsData, $state) {
        var vm = this
        vm.data = {}

        vm.sendSearch = function(){
            PetsData.pets.length = 0
            PetsData.getPets(vm.data)
            vm.data = {}
            $state.go('tab.pets')
        }
    }



})()
