define(["jquery","UtilDir/util","UtilDir/grid","ResourceDir/resourceSupport"],function($,util,grid,support){

    return function($compile,$scope){
        $scope.$apply(function () {
            $scope.resource = {
                    "template":{
                        "editResource": getStaticPath()+ "app/system/resource/views/resourceEdit.html"
                    },
                    "entity":{},
                    "saveEntity":function(){
                        //数据验证
                        if($("#resourceFormId").valid()){
                            //验证通过，保存数据
                            $.ajax({
                                "url":getServer()+"/permission/save",
                                "type":"POST",
                                "data":$scope.resource.entity,
                                "dataType":"json",
                                "success":function(data){
                                    console.log(data);
                                    if(data.status=="200"){
                                        //表格刷新
                                        grid.getGrid("resourceList").refresh();
                                        util.alert("保存成功.");
                                    }else{
                                    	util.alert("保存失败.");
                                    }
                                }
                            });
                        }
                    },
                    "delEntity":function(){

                    }
            };

        });

        //左侧资源树的数据
        $scope.resourceTree;
        //Grid初始化
        support.resourceListInit("root",$scope,$compile);
        //左侧树获取数据
        support.getResourceTree($scope);

        /*********************************************************************/
        //附件上传组件测试
        $scope.upload = {
            searchURL:getServer()+"/caiji/opus/file?opusId=8a9494814a2775db014a28e5206f0007",
            formData:{
                bizType:'10'
            }
        };
        $scope.showUploadFilesID = function(){
            console.log($scope.upload);
        };
        //单附件上传测试
        require(['UtilDir/simpleFileUpload'],function(upload){
            var settings = {
                placeAt:"simpleUploadTestId",
                formData:{
                    bizType:'10'
                }
            };
            upload.init(settings);
        })
    };
});