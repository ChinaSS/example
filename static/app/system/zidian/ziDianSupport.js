define(["UtilDir/grid","UtilDir/util","app/baseSupport","ZTree","css!ZTreeCss"],function(grid,util,baseSupport){
    var entityFormId = "entityForm",
        editPanelId = "editPanel",
        menuId = "menuList",
        gridId = "mainGrid",
        gridName = "mainGrid",
        validationConfig = {
            rules:{
                dictCode:"required",
                dictType:"required"
            },
            messages:{
                dictCode:"请输入代码",
                dictType:"请输入类型"
            }
        },
        result = {};

    function showSlidebar(){
        //弹出侧边栏
        util.slidebar({
            id:editPanelId,
            width:"500px",
            afterLoad:function(){
                $("#"+entityFormId).validate(validationConfig);
            }
        });
    }

    result.setSelectEntity = function ($scope) {
        $scope.select = {
            value : "",
            options : [
                {
                    "id" : 1,
                    "name" : "test1"
                },
                {
                    "id" : 2,
                    "name" : "test2"
                }
            ]
        };
    };

    result.saveEntity = function($scope){
        //数据验证
        if($("#"+entityFormId).valid()){
            //验证通过，保存数据
            $.ajax({
                url:getServer()+"/dict/save",
                "type":"POST",
                "data": $scope.data.entity,
                "dataType":"json",
                "success":function(data){
                    if(data.status=="200"){
                        //表格刷新
                        grid.getGrid(gridId).refresh();
                        util.alert("保存成功.");
                    }
                },
                "error":function(XMLHttpRequest, textStatus, errorThrown ){
                    util.alert("保存失败.")
                }
            })
        }
    };

    result.delEntity = function($scope){

    };

    result.scopeTest = function ($compile,$scope) {
        baseSupport.contentDialog($compile,$scope,{
            setting : {
                title : "ScopeTest"
            },
            template : getStaticPath()+"app/system/zidian/views/scopeTest.html",
            afterLoad : function(dialog){
                // code
            }
        });
    };

    result.gridInit = function(id,$scope){
        var config = {
            id:gridName,
            placeAt:gridId,            //存放Grid的容器ID
            pageSize:10,                         //一页多少条数据
            index:"checkbox",                   //首列为单选[radio]还是多选[checkbox],默认checkbox
            layout:[
                {name:"名称",field:"dictName",click:function(e){
                    //console.log(e.data);
                    var id = e.data.row.dictId;
                    $.ajax({
                        "url":getServer()+"/dict/query?dictId="+id,
                        "type":"POST",
                        "async":false,
                        "dataType":"json",
                        "success":function(d){
                            //设置资源数据
                            $scope.$apply(function () {
                                $scope.data.entity = d.entity;
                            });
                            showSlidebar();
                        }
                    });
                }},
                {name:"代码",field:"dictCode"},
                {name:"类型",field:"dictType"},
                {name:"排序",field:"orderNumber"}
            ],
            toolbar:[
                {name:"添加",class:"fa fa-plus-circle",callback:function(event){
                    //清空资源数据
                    $scope.$apply(function () {
                        $scope.data.entity = {
                            dictType : id
                        };
                    });
                    showSlidebar();
                }},
                /*{name:"编辑",class:"fa fa-edit",callback:function(event){
                 console.log('编辑')
                 }},*/
                {name:"删除",class:"fa fa-trash-o",callback:function(event){
                    var selected = grid.getGrid(gridname).getSelectedRow();
                    if(selected.length){
                        var dictIds = [];
                        for(var i= 0,item;item=selected[i++];){
                            dictIds.push(item.dictId)
                        }
                        $.ajax({
                            "url":getServer()+"/dict/remove",
                            "type":"POST",
                            "data":"dictId="+dictIds.join(","),
                            "dataType":"json",
                            "success":function(data){
                                //console.log(data);
                                if(data.status=="200"){
                                    //表格刷新
                                    grid.getGrid(gridname).refresh();
                                    util.alert("删除成功.");
                                }
                            },
                            "error":function(XMLHttpRequest, textStatus, errorThrown ){
                                //console.log(textStatus);
                                util.alert("删除失败.");
                            }
                        })
                    }else{
                        util.alert("请选择要删除的数据.");
                    }
                }}
            ],
            data: {type:"URL",value:getServer()+"/dict/list?dictType="+id},
            trEvent : {
                "dblclick" : function(data){
                    console.log(data);
                }
            }
        };
        grid.init(config);
    };

    result.menuTreeInit = function ($scope) {
        var $tree = $('#'+menuId);
        $.ajax({
            //"url":"app/system/resource/data/resourceTree.json",
            "url": getServer()+"/dict/menu",
            "type":"POST",
            "dataType":"json",
            "success":function(data) {
                /* if(typeof(data)=="string") {
                 data = JSON.parse(data);
                 }*/
            	if(data.status=="200"){
                var arr = [{ "id": "DICT_TYPE", "name": "资源目录", "open": true }];
                //var arr = [];
                for(var i= 0,item; item=data.curPageData[i++];){
                    arr.push({ "id":item.dictCode, "pId":item.dictType, "name":item.dictName});
                }
                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onClick:function (event, treeId, treeNode) {
                            //查询出该节点下的数据，初始化表格
                            result.gridInit(treeNode.id,$scope);
                        }
                    }
                };
                $.fn.zTree.init($tree, setting, arr);
            	}
            }
        });
    };

    return result;
});