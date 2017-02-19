
// 注册模块
var regApp = angular.module('regApp', []);
regApp.controller('regCtrl', function ($scope, $http) {
    $scope.postForm = function () {
        console.log($scope.formData)
        $http({
            method: 'POST',
            url: '/reg',
            data: $.param($scope.formData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
            console.log(data.code + ":" +data.message)
            if (data.code == 'success') {
                location.href = '#/index'
            }
            else{
                alert(data.message)
            }
        })
    }
})


// 登陆模块
var loginApp = angular.module('loginApp',[]);
loginApp.controller('loginCtrl',function($scope,$http){
    $scope.postForm = function(){
        $http({
            method : 'POST',
            url : '/login',
            data : $.param($scope.formData),
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
            if(data.code == 'success'){
               location.href = '#/index'
            }
            else{
                alert(data.message)
            }
        })
    }
})