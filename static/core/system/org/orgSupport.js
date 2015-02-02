/**
 * Created by YiYing on 2015/1/14.
 */
define(["UtilDir/grid","UtilDir/util","ZTree","css!ZTreeCss"],function(grid,util){

    var sysPath = "core/system";

    /**
     * 创建部门树
     */
    var createDeptTree = function(element){
        $.ajax({
            //静态数据
            "url":sysPath+"/org/data/OrgTree.json",
            //"url": getServer()+"/v1/org/dept",
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
                            $("#orgShowListTitle").html("组织-"+treeNode.name);
                            showListPanel();
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
                            $("#orgShowListTitle").html("角色-"+treeNode.name);
                            showListPanel();
                            //查询出该节点下的所有角色信息
                            showRoleList(treeNode.id);
                            /*//显示角色相关操作
                            $scope.$apply(function () {
                                $scope.opt.curSelectRole = treeNode.id;
                            });*/
                            //单击节点展开
                            $.fn.zTree.getZTreeObj("roletree").expandNode(treeNode);
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
                    $("#orgShowListTitle").html("高级-"+treeNode.name);
                    showListPanel();

                    switch(treeNode.id){
                        case "GWConfig":
                            showGWList();
                            break;
                        case "ZWConfig":
                            showZWList();
                            break;
                        case "AllDept":
                            showAllDeptList();
                            break;
                        case "AllPerson":
                            showPersonList();
                            break;
                        case "AllRole":
                            showRoleList();
                            break;
                        case "RoleDir":

                            break;
                        case "NoDeptPerson":
                            showPersonList();
                            break;
                        case "LockPerson":
                            showPersonList();
                            break;
                        case "LockDept":
                            showAllDeptList();
                            break;
                        case "Log":

                            break;
                    }

                    /*//显示相关操作
                    if(treeNode.id=="GWConfig"){
                        $scope.$apply(function () {$scope.opt.curSelectConfig = "GW";});
                    }else if(treeNode.id=="ZWConfig"){
                        $scope.$apply(function () {$scope.opt.curSelectConfig = "ZW";});
                    }else{
                        $scope.$apply(function () {$scope.opt.curSelectConfig = "";});
                    }*/
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
     * 显示信息列表容器
     */
    var showListPanel = function(){
        //显示隐藏控制
        $("#orgMainId").hide();
        $("#orgShowListContent").empty();
        $("#orgShowListPanel").show();
    };


    /**
     * 主页初始化
     */
    var orgMainInit = function(){
        createDeptTree($("#orgtree"));
        createRoleTree($("#roletree"));
        createConfigTree($("#orgConfigTree"));
    };

    //数据列表公共部分
    var comConfig = {
        placeAt:"orgShowListContent",        //存放Grid的容器ID
        pageSize:10                          //一页多少条数据
    };
    /**
     * 显示人员列表
     * @param id
     */
    var showPersonList = function(id){
        var config = {
            id:"OrgPersonList",
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
                    showPersonSidebar();
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
        grid.init($.extend(config,comConfig));
    };

    /**
     * 显示角色列表
     * @param id
     */
    var showRoleList = function(id){
        var config = {
            id: "OrgRoleList",
            layout: [
                {
                    name: "角色编号", field: "roleCode", click: function (e) {
                    //console.log(e.data);

                    }
                },
                {name: "角色名称", field: "roleName"},
                {name: "管理员", field: "managerName"},
                {name: "所属目录", field: "dirName"},
                {name: "序号", field: "sort"}
            ],
            data: {
                "type": "URL",
                "value": sysPath + "/org/data/Roles.json"
            }
        };
        grid.init($.extend(config,comConfig));
    };

    /**
     * 显示岗位列表
     */
    var showGWList = function(){
        var config = {
            id: "OrgGWList",
            layout: [
                {
                    name: "岗位编号", field: "gwCode", click: function (e) {
                        //console.log(e.data);
                        showGWSidebar();
                    }
                },
                {name: "岗位名称", field: "gwName"},
                {name: "序号", field: "sort"}
            ],
            data: {
                "type": "URL",
                "value": sysPath + "/org/data/GWs.json"
            }
        };
        grid.init($.extend(config,comConfig));
    };

    /**
     * 显示职务列表
     */
    var showZWList = function(){
        var config = {
            id: "OrgZWList",
            layout: [
                {
                    name: "职务编号", field: "zwCode", click: function (e) {
                        //console.log(e.data);
                        showZWSidebar();
                    }
                },
                {name: "职务名称", field: "zwName"},
                {name: "序号", field: "sort"}
            ],
            data: {
                "type": "URL",
                "value": sysPath + "/org/data/ZWs.json"
            }
        };
        grid.init($.extend(config,comConfig));
    };

    /**
     * 显示所有部门列表
     */
    var showAllDeptList = function(){
        var config = {
            id: "OrgAllDeptList",
            layout: [
                {
                    name: "部门名称", field: "deptName", click: function (e) {
                    //console.log(e.data);

                    }
                },
                {name: "部门编号", field: "deptCode"},
                {name: "部门领导", field: "leader"},
                {name: "所属组织", field: "pDeptName"},
                {name: "序号", field: "sort"}
            ],
            data: {
                "type": "URL",
                "value": sysPath + "/org/data/AllDept.json"
            }
        };
        grid.init($.extend(config,comConfig));
    };

    /******************************侧边栏**********************************/
    //弹出人员侧边栏
    var showPersonSidebar = function(){
        util.slidebar({
            url:getStaticPath()+"/core/system/org/views/orgPerson.html",
            width:"800px"
        });
    };
    //弹出部门侧边栏
    var showDeptSidebar = function(){
        util.slidebar({
            url:getStaticPath()+"/core/system/org/views/orgDept.html",
            width:"800px"
        });
    };
    //弹出角色目录侧边栏
    var showRoleDirSidebar = function(){
        util.slidebar({
            url:getStaticPath()+"/core/system/org/views/orgDept.html",
            width:"800px"
        });
    };
    //弹出岗位侧边栏
    var showGWSidebar = function(){
        util.slidebar({
            url:getStaticPath()+"/core/system/org/views/orgGW.html",
            //id:"EditGWPanel",
            width:"500px"
        });
    };
    //弹出职务侧边栏
    var showZWSidebar = function(){
        util.slidebar({
            url:getStaticPath()+"/core/system/org/views/orgZW.html",
            //id:"EditZWPanel",
            width:"500px"
        });
    };

    return {
        orgMainInit:orgMainInit
    }
});