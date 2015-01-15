/**
 * Created by YiYing on 2015/1/14.
 */
define(["UtilDir/grid","ZTree","css!ZTreeCss"],function(grid){

    var sysPath = "core/system";

    /**
     * 创建部门树
     */
    var createDeptTree = function(element){
        $.ajax({
            //静态数据
            "url":sysPath+"/org/data/OrgTree.json",
            //"url": util.getServerPath()+"/org/dept/v1/",
            "success":function(data) {
                //数据转换
                //console.log(data)
                if(typeof(data)=="string") return;
                /*var arr = [];
                for(var i= 0,dept; dept=data[i++];){
                    if(dept.deptId=="root"){
                        arr.push({ "id": "root", "name": dept.deptName, "open": true });
                    }else{
                        arr.push({ "id":dept.deptId, "pId":dept.pdeptId, "name":dept.deptName});
                    }
                }*/
                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onClick:function (event, treeId, treeNode) {
                            showPersonList(treeNode.id);
                            /*require(["viewFrame"],function(VF){
                                var VFParam = VF.config;
                                VFParam.title = "组织-"+treeNode.name;
                                //查询出该组织节点下的所有人员信息
                                $.ajax({
                                    "url":sysPath+"/org/data/Persons.json",
                                    "dataType":"json",
                                    "success":function(data){
                                        $scope.$apply(function () {
                                            $scope.ViewFrame = $.extend(VFParam,data);
                                        });
                                    }
                                });
                            });
                            //显示组织相关操作
                            $scope.$apply(function () {
                                $scope.opt.curSelectOrg = treeNode.id;
                            });*/

                            $("#orgMainId").hide();
                            //单击节点展开
                            $.fn.zTree.getZTreeObj("orgtree").expandNode(treeNode);
                        }
                    }
                };
                $.fn.zTree.init(element, setting, data);
            }
        });
    };

    /**
     * 创建角色树
     */
    var createRoleTree = function(element){
        $.ajax({
            "url":sysPath+"/org/data/RoleTree.json",
            //"url": util.getServerPath()+"/org/roleDir/v1/",
            "success":function(data) {
                if(typeof(data)=="string") return;
                /*var arr = [];
                for(var i= 0,dir; dir=data[i++];){
                    if(dir.dirCode=="root"){
                        arr.push({ "id": "root", "name": dir.dirName, "open": true });
                    }else{
                        arr.push({ "id":dir.dirCode, "pId":dir.pdirCode, "name":dir.dirName});
                    }
                }*/
                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onClick:function (event, treeId, treeNode) {
                            //查询出该节点下的所有角色信息

                            //显示角色相关操作
                            $scope.$apply(function () {
                                $scope.opt.curSelectRole = treeNode.id;
                            });
                        }
                    }
                };
                $.fn.zTree.init(element, setting, data);
            }
        });
    };

    /**
     * 创建高级功能树
     */
    var createConfigTree = function(element){
        var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick:function (event, treeId, treeNode) {
                    //查询出该节点下的所有角色信息

                    //显示相关操作
                    if(treeNode.id=="GWConfig"){
                        $scope.$apply(function () {$scope.opt.curSelectConfig = "GW";});
                    }else if(treeNode.id=="ZWConfig"){
                        $scope.$apply(function () {$scope.opt.curSelectConfig = "ZW";});
                    }else{
                        $scope.$apply(function () {$scope.opt.curSelectConfig = "";});
                    }
                }
            }
        };
        $.fn.zTree.init(element, setting, [
            { "id": "root", "name": "高级功能", "open": true },
            { "id": "GWConfig", "pId":"root", "name": "岗位管理"},
            { "id": "ZWConfig", "pId": "root", "name": "职务管理"},
            { "id": "AllDept", "pId":"root", "name": "所有部门列表"},
            { "id": "AllPerson", "pId": "root", "name": "所有人员列表"},
            { "id": "AllRole", "pId": "root", "name": "所有角色列表"},
            { "id": "RoleDir", "pId": "root", "name": "角色目录列表"},
            { "id": "NoDeptPerson", "pId": "root", "name": "未归属部门人员列表"},
            { "id": "LockPerson", "pId": "root", "name": "冻结人员列表"},
            { "id": "LockDept", "pId": "root", "name": "冻结部门列表"},
            { "id": "Log", "pId": "root", "name": "特殊操作日志"}
        ]);
    };

    /**
     * 主页初始化
     */
    var orgMainInit = function(){
        createDeptTree($("#orgtree"));
        createRoleTree($("#roletree"));
        createConfigTree($("#orgConfigTree"));
    };


    var showPersonList = function(id){
        //面板清空
        $("#orgShowListPanel").empty().show();

        var config = {
            id:"OrgPersonList",
            placeAt:"orgShowListPanel",          //存放Grid的容器ID
            pageSize:20,                         //一页多少条数据
            layout:[
                {name:"用户名",field:"UserName",click:function(e){
                    //console.log(e.data);
                    /*var id = e.data.row.resourcesId;
                    $.ajax({
                        "url":getServer()+"/permission/query?resId="+id,
                        async:false,
                        dataType:"json",
                        "success":function(d){
                            //设置资源数据
                            $scope.$apply(function () {
                                $scope.resource.entity = d.entity;
                                $scope.resource.type = dict.resourceType();
                            });
                            showSlidebar();
                        }
                    });*/
                }},
                {name:"姓名",field:"Name"},
                {name:"员工编号",field:"UserCode"},
                {name:"办公电话",field:"OfficePhone"},
                {name:"移动电话",field:"Phone"},
                {name:"邮件",field:"EMail"}
            ],
            data:{
                "type":"URL",
                "value":sysPath+"/org/data/Persons.json"
            }
        };
        grid.init(config);
    };

    return {
        orgMainInit:orgMainInit
    }
});