define(["PDAclDir/aclRes",//资源管理
        "PDAclDir/aclSet",//授权管理
        "PDAclDir/aclUpdate"//变更管理
        ],
    function(AclRes, AclSet, AclUpdate){
    
    /**
     * 主页初始化
     */
    var init = function(){
        //初始化资源模块
    	AclRes.init();
    	//初始化资源授权模块
    	AclSet.init();
    	//初始化资源变更模块
    	AclUpdate.init();
    };

    return {
        init:init
    }
});