/**
 * 组织机构信息管理
 * @author gaodsh@css.com.cn
 */
 define(["jquery","UtilDir/grid","OrgDir/orgSupport",'UtilDir/util'],function($,grid,support,util){

    return function($compile,$scope){
        $scope.$apply(function () {
            $scope.org = {
                    template:{
                        orgEdit: getStaticPath()+ "app/system/org/views/orgEdit.html"
                    },
                    entity:{},
                    orgCode:false,
                    query:{
                    	dto:{orgName:'',orgType:''},
                    	query:function(){
                    		 support.orgListInit($scope);
                    	},
                    	reset:function(){
                    		this.dto = {orgName:'',orgType:''};
                    	}
                    },
                    saveEntity:function(){support.save($scope);},
                    validate:function(){},
                    delEntity:function(){},
                    isModify:function(){
                    	return support.isModify($scope);
                    },
                    type:{
	                    type : "select",
	                    searchAble: true,
	                	data: []
	                },
	                region:{
	                	type : "select",
	                    searchAble: true,
	                	data: []
	                },
	                tree:{
	                	save :function(){
	                		support.saveOrgTree();
	                	}
	                }
            };
            
            
        });
        
       //列表初始化
       support.orgListInit($scope);
       //初始化树数据
       support.initTree($scope);
	   
    };
    

});
 