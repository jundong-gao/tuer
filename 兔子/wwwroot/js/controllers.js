
// 注册模块
var regApp = angular.module('regApp', []);
regApp.controller('regCtrl', function ($scope, $http) {
    $scope.postForm = function () {
        // console.log($scope.formData)
        $http({
            method: 'POST',
            url: '/reg',
            data: $.param($scope.formData),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (data) {
            console.log(data.code + ":" +data.message)
            if (data.code == 'success') {
                $scope.data = data
                location.href = '#/user_index'
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
                $scope.data = data
                console.log($scope.data.user)
                location.href = '#/user_index'
            }
            else{
                alert(data.message)
            }
        })
    }
})

// 写日记
var diaryApp = angular.module('diaryApp',[]);
diaryApp.controller('diaryCtrl',function($scope,$http){
    $scope.postForm = function(){
        console.log($scope.formData)
        $http({
            method : 'POST',
            url : '/diary',
            data : $.param($scope.formData),
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
           if(data.code == 'success'){
               $scope.data = data;
               location.href = '#/find'
           }else{
               alert(data.message)
           }
        })
    }
})


// 发现页面。显示最近的所有日记
var findApp = angular.module('findApp',[]);
findApp.controller('findCtrl',function($scope,$http){
    $http.get('/allDiary').success(function(data){
        console.log(data.data)
        console.log(data.data[0]._id)
        $scope.data = data.data
    })
})

// 上传头像
var uploadApp = angular.module('uploadApp',[]);
uploadApp.controller('uploadCtrl',function($scope,$http){
    $scope.upload = function (){
        $http({
            method : "POST",
            url : "/upload",
            data : $scope.formData
        }).success(function(data){
            alert(data.code)
            console.log(data)
        })
    }
})

// 未登录的时候显示的首页
// 显示十篇日记
var shouyeApp = angular.module('shouyeApp',[]);
shouyeApp.controller('shouyeCtrl',function($scope,$http){
    $http.get('/shouye').success(function(data){
        $scope.data = data.data;
        console.log(data)
    })
})


// 日记详情
var articleApp = angular.module('articleApp',[]);
articleApp.controller('articleCtrl',function($scope,$http,$stateParams){
    // console.log($stateParams.id)
    $http.get('/diarys/' + $stateParams.name + '/' + $stateParams.second).success(function(data){
        console.log(data.data)
        $scope.data = data.data
        $scope.user = data.user
        
    })
    $scope.postForm = function(){

        // 提交回复
        $http({
            method : 'POST',
            url : '/comment/' + $scope.data.name + '/' + $scope.data.time.second,
            data : $.param($scope.formData),
            headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
        }).success(function(data){
            if(data.code == 'success'){
                location.reload()
            }else{
                alert(data.message)
            }
        })
    }
})