angular.module('GithubClient', ['ngRoute'])
    
    .config(function($routeProvider) {
        
        $routeProvider
            .when('/', {
                controller: 'LoginController',
                templateUrl: 'partials/login.html'    
            })
            .when('/profile', {
                controller: 'ProfileController',
                templateUrl: 'partials/profile.html'
            })
    })

    .controller('LoginController', ['$scope', '$http', function ($scope, $http) {

        $scope.profile_data;

        $scope.ViewProfile = function() {

            $http.get("https://api.github.com/users/" + $scope.username)
                
            .success( function (data, status, headers, config) {

                $scope.profile_data = data;

                document.write('Name:' + data.name + "<br />");
                document.write('Company:' + data.company + "<br />");
                document.write('Public Repos:' + data.public_repos + "<br />");
                document.write('Public Gists:' + data.public_gists + "<br />");

                console.log(status);
            })
            
            .error( function (data, status, headers, config) {
                document.write(status);
                console.log(status);
            });

        };

    }])

    .controller('ProfileController', ['$scope', '$http', function ($scope, $http) {

    }]);