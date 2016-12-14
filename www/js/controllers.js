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
        vm.chosenPets = []
        
        vm.choosePet = function(pet){
            PetsData.choosePet(pet)
            vm.chosenPets = PetsData.chosenPets
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

    function AccountCtrl (PetsData) {
        var vm = this
        
        vm.chosenPets = PetsData.chosenPets
        
        vm.choosePet = function(pet){
            PetsData.choosePet(pet)
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
