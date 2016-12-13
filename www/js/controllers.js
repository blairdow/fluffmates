(function(){
     angular.module('fluffMates')
        .controller('PetsCtrl', PetsCtrl)
        .controller('AccountCtrl', AccountCtrl)
        .controller('SearchCtrl', SearchCtrl)


    PetsCtrl.$inject = ['$http', 'PetsData']
    AccountCtrl.$inject = ['PetsData']
    SearchCtrl.$inject = ['PetsData', '$state']

    function PetsCtrl($http, PetsData) {
        var vm = this
        vm.pets = PetsData.pets

        vm.choosePet = function(pet){
            if(PetsData.chosenPets.indexOf(pet) < 0){
              pet.chosen = true
              PetsData.chosenPets.push(pet)

              if(PetsData.chosenPets.length > 3){
                var removed = PetsData.chosenPets.shift()
                removed.chosen = false
                pet.chosen = true
                console.log('removed', removed)
              }
            }
            console.log('chosen pets', PetsData.chosenPets)
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
