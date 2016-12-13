(function(){
     angular.module('fluffMates')
        .controller('PetsCtrl', PetsCtrl) 
        .controller('AccountCtrl', AccountCtrl)
        .controller('SearchCtrl', SearchCtrl)


    PetsCtrl.$inject = ['$http', 'PetsData']
    AccountCtrl.$inject = ['PetsData']
    SearchCtrl.$inject = ['PetsData']

    function PetsCtrl($http, PetsData) {
        var vm = this
        
        vm.data = PetsData
            
        vm.getPets = function(){
            console.log('clicked')
            $http.get('http://localhost:3000/pets?' + $.param(vm.data)).then(function(response){
                vm.pets = response.data;
                console.log(vm.pets)
            }, function(err){
                console.log(err)
            })
        }
    }

    function AccountCtrl () {
        var vm = this

        vm.settings = {
            enableFriends: true
        }
    }
    
    function SearchCtrl (PetsData) {
        var vm = this
        
        vm.searchInput = {}
        
        vm.sendSearch = function(){
            
        }
    }


    
})()
