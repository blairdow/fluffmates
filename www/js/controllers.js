(function(){
     angular.module('fluffMates')
        .controller('PetsCtrl', PetsCtrl)
        .controller('AccountCtrl', AccountCtrl)
        .controller('SearchCtrl', SearchCtrl)
        .controller('LoginCtrl', LoginCtrl)
        .controller('RegisterCtrl', RegisterCtrl)

    PetsCtrl.$inject = ['$http', 'PetsData', '$ionicModal', '$scope', 'userDataService', 'authService']
    AccountCtrl.$inject = ['PetsData', 'userDataService', '$state', 'authService', '$ionicModal', '$scope', '$timeout']
    SearchCtrl.$inject = ['PetsData', '$state', 'userDataService', 'authService']
    LoginCtrl.$inject = ['authService', '$state']
    RegisterCtrl.$inject = ['$http', 'authService', 'authToken', '$state']

    function PetsCtrl($http, PetsData, $ionicModal, $scope, userDataService, authService) {
        var vm = this
        vm.pets = PetsData.pets
        authService.setUser()
        vm.user = userDataService.user

        vm.showPet = {}
        vm.chosenPets = []

        vm.choosePet = function(pet){
            PetsData.choosePet(pet, vm.user)
            vm.chosenPets = PetsData.chosenPets
            vm.user.chosenPets = vm.chosenPets            
        }

        vm.showPetInfo = function(pet){
          vm.showPet = pet

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

        vm.showChosenPets = function(){
            if(vm.chosenPetsModal) {vm.chosenPetsModal.remove()}

            $ionicModal.fromTemplateUrl('./templates/chosen-pets-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            })
            .then(function(modal){
                vm.chosenPetsModal = modal
                vm.chosenPetsModal.show()
            })
        }

        vm.closeChosenModal = function(){
            console.log('closed')
            vm.chosenPetsModal.hide()
        }
    }

    function AccountCtrl (PetsData, userDataService, $state, authService, $ionicModal, $scope, $timeout) {
        var vm = this
        authService.setUser()
        vm.user = userDataService.user
        vm.isLoggedIn = authService.isLoggedIn;
        vm.updateUser = {}

        vm.chosenPets = PetsData.chosenPets

        vm.editModal = function(user){
            vm.updateUser = user

            if(vm.modal) {vm.modal.remove()}

            $ionicModal.fromTemplateUrl('./templates/edit-user-modal.html', {
              scope: $scope,
              animation: 'slide-in-up'
            })
            .then(function(modal){
              vm.modal = modal
              vm.modal.show()
            })
        }

        vm.closeEditModal = function(){
            vm.modal.hide()
            vm.updateUser = {}
            $timeout(function(){
                vm.modal.remove()
            }, 4000)
        }

        vm.editUser = function(){
            userDataService.update(vm.updateUser._id, vm.updateUser)
            .then(function(res){
              console.log(res)
              vm.closeEditModal()
              authService.setUser()
              vm.user = userDataService.user
            })
        }

        vm.logout = function(){
            authService.logout()
        }

        vm.choosePet = function(pet){
            PetsData.choosePet(pet, vm.user)
        }
    }

    function RegisterCtrl ($http, authService, authToken, $state){
      var vm = this
      vm.newUser = {}

      vm.createUser = function() {
          $http.post('http://localhost:3000/users', vm.newUser)
          .then(function(res){
            authToken.setToken(res.data.token)
            authService.setUser()
            vm.newUser = {}
            $state.go('tab.search')
          })
        }

      vm.go = function(state){
          $state.go(state)
      }

    }

    function LoginCtrl(authService, $state){
      var vm = this
      vm.isLoggedIn = authService.isLoggedIn;
      vm.loginData = {}

      if(vm.isLoggedIn == true){
        $state.go('tab.search')
      }

      vm.login = function(){
          authService.login(vm.loginData.email, vm.loginData.password)
            .then(function(res) {
              vm.loginData = {}
              $state.go('tab.search');
            });
        }

      vm.go = function(state){
          $state.go(state)
      }
    }

    function SearchCtrl (PetsData, $state, userDataService, authService) {
        var vm = this
        vm.data = {}
        authService.setUser()
        vm.user = userDataService.user

        console.log('service', vm.user)

        vm.sendSearch = function(){
            PetsData.pets.length = 0
            PetsData.getPets(vm.data)
            vm.data = {}
            $state.go('tab.pets')
        }
    }

})()
