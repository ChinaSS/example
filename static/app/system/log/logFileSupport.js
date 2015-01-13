define(["UtilDir/util","UtilDir/grid"],function(util,grid){
	
	//数据列表
    var logFileListInit = function($scope){
        var config = {
            id:"logFileList",
            placeAt:"logFileListId",           
            pageSize:15,                         
            layout:[
                {name:"文件名",field:"fileName"},
                {name:"大小(KB)",field:"fileSize"},
                {name:"最后修改时间",field:"fileDate"},
                {name:"下载",format:function(obj){
                	return '<a href="'+getServer()+'/log/download?logName='+obj.row.fileName+'"><i class="glyphicon glyphicon-download" style="cursor:pointer" title="下载"></i></a';
                }}
            ],
            data : {type : "URL",value : getServer() + "/log/logFile"},
            formData:{
            	
            }
        };
        grid.init(config);
    };
    
    return {
        logFileListInit:logFileListInit
    };
});