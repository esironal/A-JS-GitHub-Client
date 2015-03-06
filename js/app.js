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
            .when('/repositories/:username', {
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

    .controller('LoginController', function ($scope, $http, $location, ProfileData) {

        //Fetch Profile Data
        //------------------
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

    })


    //======================
    // Profile page
    //======================

    .controller('ProfileController', function ($scope, $http, $location, $routeParams, ProfileData) {

        $scope.profile_data = ProfileData.getData();
        $scope.username = ProfileData.getUser();


        //Code to fetch the Profile Data if the profile page is refreshed
        //---------------------------------------------------------------
        $scope.FetchProfileData = function() {

            //Save username in service
            ProfileData.setUser($scope.username);


            $http.get("https://api.github.com/users/" + $scope.username)

            .success( function (data, status, headers, config) {

                $scope.profile_data = data;

                ProfileData.setData(data);

                $location.path('/profile/' + $scope.username);

                console.log(data, status);

            })

            .error( function (data, status, headers, config) {
                console.log(data, status, "profile fetch error", headers);
                $scope.profileRequestError = "Error Fetching profile info.";

                //$location.path("/");
            });

        };


        //Check whether the same user-profile needs to be fetched again or whether a new profile needs to be fetched    
        //----------------------------------------------------------------------------------------------------------
        if( $scope.username == "" ) {
            $scope.username = $routeParams.username;
            $scope.FetchProfileData();
        } else if( $scope.username !== $routeParams.username ) {
            $scope.username = $routeParams.username;
            $scope.FetchProfileData();
        }


        //Code to fetch the repository list
        //---------------------------------
        $scope.ShowRepositoryList = function() {

            $http.get("https://api.github.com/users/" + $scope.username + "/repos")

            .success( function (data, status, headers, config) {

                //save repository list in service
                ProfileData.setRepositoryList(data);

                //console.log(data);
                $location.path('/repositories/' + $scope.username);

            })

            .error( function (data, status, headers, config) {
                console.log(data, status, "repository-list fetch error");
            });
        }

    })


    //======================
    // Repository List page
    //======================

    .controller('RepositoryListController', function ($scope, $http, $location, $routeParams, ProfileData) {

        $scope.profile_data = ProfileData.getData();
        $scope.repository_list = ProfileData.getRepositoryList();
        //console.log($scope.repository_list);
    
        $scope.username = ProfileData.getUser();

    });