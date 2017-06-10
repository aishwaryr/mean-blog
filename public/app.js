(function() {
    angular.module("BlogApp", []).controller("BlogController", BlogController);

    function BlogController($scope, $http) {
        $scope.myName = 'napster';

        //Put everything here that you want to run o init.
        function init() {
            getAllPosts();
        }
        init();

        function getAllPosts() {
            //returns a client side promise
            $http.get("/api/blogPost").then(function (posts) {
                console.log(posts);
                $scope.posts = posts.data;
            }, function (err){

            });
        }

        $scope.postBlog = function(post) {
            console.log(post);
            $http.post("/api/blogPost", post).then(function (posts) {
                getAllPosts();
            }, function (err){

            });
        }

        $scope.deletePost = function(postId) {
            $http.delete("api/blogPost/"+postId).then(function (res){
                getAllPosts();
            }, function (err){
                console.log(err);
            });
        }
    };

})();
