define(["UtilDir/util","UtilDir/grid"],function(util,grid){
	
	//数据列表
    var logListInit = function($scope){
        var config = {
            id:"logList",
            placeAt:"logListId",           
            pageSize:15,                         
            layout:[
                {name:"时间",field:"createTime"},
                {name:"用户",field:"createUser"},
                {name:"IP地址",field:"ipAddress"},
                {name:"访问路径",field:"logUrl"},
                {name:"是否成功",field:"isSuccess"},
                {name:"备注",field:"remark"}
            ],
            data : {type : "URL",value : getServer() + "/log/page"},
            formData:{
            	
            }
        };
        grid.init(config);
    };
    
    return {
        logListInit:logListInit
    };
});