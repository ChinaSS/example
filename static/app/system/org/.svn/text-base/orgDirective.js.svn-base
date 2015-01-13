/**
 * 
 * 验证组织代码是否存在
 * @author gaodsh@css.com.cn
*/	
 define(["OrgDir/orgSupport"],function(support){
    var Directive = {};
    
    Directive.codeUnique = function ($scope, element, attrs,ctrl, $http) {
	 		$scope.$watch(attrs.ngModel, function() {
		        $http({
		          method: 'POST',
		          url: getServer() + "/org/queryByOrgCode?orgCode=" + ctrl.$modelValue
		        }).success(function(data, status, headers, cfg) {
		            $scope.$parent.org.orgCode=data;
		        }).error(function(data, status, headers, cfg) {
		        	$scope.$parent.org.orgCode=false;
		        });
	       });	
    };
    return Directive;
});