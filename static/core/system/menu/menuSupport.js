define(["PDMenuDir/menu",//菜单管理
        "PDMenuDir/menuSet",//授权管理
        "PDMenuDir/menuUpdate"//变更管理
        ],
    function(Menu, MenuSet, MenuUpdate){
    
    /**
     * 主页初始化
     */
    var init = function(){
        //初始化资源模块
    	Menu.init();
    	//初始化资源授权模块
    	MenuSet.init();
    	//初始化资源变更模块
    	MenuUpdate.init();
    };

    return {
        init:init
    }
});