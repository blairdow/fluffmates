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
