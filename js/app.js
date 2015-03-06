angular.module('GithubClient', ['ngRoute'])


    //=========================
    // Service for profile data
    //=========================

    .service('ProfileData', function() {
        
        var profile_service_data = {};
        var user_name = "";
        var repository_list = {};

        return {
            getUser: function() {
                return user_name;
            },
            setUser: function(username) {
                user_name = username;
            },
            getData: function() {
                return profile_service_data;
            },
            setData: function(data) {
                profile_service_data = data;
            },
            getRepositoryList: function() {
                return repository_list;
            },
            setRepositoryList: function(repo_list) {
                repository_list = repo_list;
                console.log(repo_list);
            }
        }
    })


    //======================
    // Config
    //======================

    .config(function($routeProvider) {

        $routeProvider
            .when('/', {
                controller: 'LoginController',
                templateUrl: 'partials/login.html'    
            })
            .when('/profile/:username', {
                controller: 'ProfileController',
                templateUrl: 'partials/profile.html'
            })
            .when('/repositories', {
                controller: 'RepositoryListController',
                templateUrl: 'partials/repositories.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    })


    //======================
    // Landing page
    //======================

    .controller('LoginController', ['$scope', '$http', '$location', 'ProfileData', function ($scope, $http, $location, ProfileData) {
        
        //Fetch Profile Data
        $scope.FetchProfileData = function() {

            //Reset the request-error string
            $scope.profileRequestError = null;

            //Show loader
            $scope.loader_active = true;

            //Save username in service
            ProfileData.setUser($scope.username);


            $http.get("https://api.github.com/users/" + $scope.username)

            .success( function (data, status, headers, config) {

                $scope.profile_data = data;

                ProfileData.setData(data);

                $location.path('/profile/' + $scope.username);

                //Hide loader
                $scope.loader_active = false;

                console.log(data, status);

            })

            .error( function (data, status, headers, config) {
                console.log(data, status, "profile fetch error", headers);
                $scope.profileRequestError = "Error Fetching profile info.";

                //Hide loader
                $scope.loader_active = false;
            });

        };

    }])


    //======================
    // Profile page
    //======================

    .controller('ProfileController', ['$scope', '$http', '$location', 'ProfileData', function ($scope, $http, $location, ProfileData) {
        
        $scope.profile_data = ProfileData.getData();
        $scope.username = ProfileData.getUser();

        $scope.callFetchMethod = function (message) {
            console.log(message);
        }
        
        if(Object.getOwnPropertyNames($scope.profile_data).length === 0) {
            $scope.callFetchMethod("No profile data yo");
        } else {
            $scope.callFetchMethod("Yep we gots the stuff");

        }

        $scope.ShowRepositoryList = function() {

            console.log($scope.profile_data);


            $http.get("https://api.github.com/users/" + $scope.username + "/repos")

            .success( function (data, status, headers, config) {

                //save repository list in service
                ProfileData.setRepositoryList(data);

                //console.log(data);
                $location.path('/repositories');

            })

            .error( function (data, status, headers, config) {
                console.log(data, status, "repository-list fetch error");
            });
        }        

    }])


    //======================
    // Repository List page
    //======================

    .controller('RepositoryListController', ['$scope', '$http', '$location', 'ProfileData', function ($scope, $http, $location, ProfileData) {
        
        $scope.profile_data = ProfileData.getData();
        $scope.repository_list = ProfileData.getRepositoryList();
        //console.log($scope.repository_list);
                
    }]);