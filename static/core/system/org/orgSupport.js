/**
 * Created by YiYing on 2015/1/14.
 */
define([
    "PDUtilDir/util",
    "PDOrgDir/deptSupport",
    "PDOrgDir/userSupport",
    "PDOrgDir/roleSupport",
    "PDOrgDir/roleDirSupport",
    "PDOrgDir/zwSupport",
    "PDOrgDir/gwSupport",
    "PDOrgDir/configSupport",
    "ZTree","css!ZTreeCss"],function(Util,Dept,User,Role,RoleDir,ZW,GW,Config){
    /**
     * 创建部门树
     */
    var createDeptTree = function(element){
        $.ajax({
            //静态数据
            //"url":sysPath+"/org/data/OrgTree.json",
            //"url": getServer()+"/v1/org/dept",
            "url": getServer()+"/sword/org/dept/getAllDept",
            "success":function(data) {
                //console.log(data)
                //数据转换zTree支持的格式
                var arr = [];
                for (var i = 0, dept; dept = data[i++];) {
                    if (dept.deptTreeId == "root") {
                        arr.push({"id": "root", "name": dept.deptName,"deptCode":dept.deptCode, "open": true});
                    } else {
                        arr.push({"id": dept.deptTreeId, "pId": dept.pDeptTreeId, "name": dept.deptName,"deptCode":dept.deptCode,"deptUuid":dept.deptUuid});
                    }
                }
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
                            User.showPersonList("getUserByDeptUuidForGrid?deptUuid="+treeNode.deptUuid);

                            //单击节点展开
                            $.fn.zTree.getZTreeObj("orgtree").expandNode(treeNode);
                            //显示组织相关操作
                            toolbarDisplay(["btn_importOrg","btn_importPerson","btn_editDept","btn_addDept","btn_addPerson"])
                        }
                    }
                };
                $.fn.zTree.init(element, setting, arr);
            }
        });
    };

    /**
     * 创建角色树
     */
    var createRoleTree = function(element){
        $.ajax({
            //"url":sysPath+"/org/data/RoleTree.json",
            //"url": util.getServerPath()+"/org/roleDir/v1/",
            "url": getServer()+"/sword/org/roledir/getAllRoleDir",
            "success":function(data) {
                var arr = [];
                for (var i = 0, dir; dir = data[i++];) {
                    if (dir.dirCode == "root") {
                        arr.push({"id": "root", "name": dir.dirName, "open": true});
                    } else {
                        arr.push({"id": dir.dirCode, "pId": dir.pDirCode, "name": dir.dirName});
                    }
                }
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
                            Role.showRoleList("getRoleByRoleDirCodeForGrid?dirCode="+treeNode.id);
                            //单击节点展开
                            $.fn.zTree.getZTreeObj("roletree").expandNode(treeNode);
                            //显示角色相关操作
                            toolbarDisplay(["btn_importRoleDir","btn_importRole","btn_editRoleDir","btn_addRoleDir","btn_delRoleDir","btn_addRole","btn_delRole"])
                        }
                    }
                };
                $.fn.zTree.init(element, setting, arr);
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
                            GW.showGWList();
                            break;
                        case "ZWConfig":
                            ZW.showZWList();
                            break;
                        case "AllDept":
                            Dept.showDeptList("getAllDeptForGrid");
                            break;
                        case "AllPerson":
                            User.showPersonList("getAllUserForGrid");
                            break;
                        case "AllRole":
                            Role.showRoleList("getAllRoleForGrid");
                            break;
                        case "RoleDir":
                            RoleDir.showRoleDirList();
                            break;
                        case "NoDeptPerson":
                            User.showPersonList("getNoDeptUserForGrid");
                            break;
                        case "LockPerson":
                            User.showPersonList("getLockedUserForGrid");
                            break;
                        case "LockDept":
                            Dept.showDeptList("getLockedDeptForGrid");
                            break;
                        case "Log":

                            break;
                    }

                    //显示相关操作
                    if(treeNode.id=="GWConfig"){
                        toolbarDisplay(["btn_importGW","btn_addGW","btn_delGW"]);       //显示岗位导入、新增岗位、删除岗位
                    }else if(treeNode.id=="ZWConfig"){
                        toolbarDisplay(["btn_importZW","btn_addZW","btn_delZW"]);       //显示职位导入、新增职务、删除职务
                    }else{
                        toolbarDisplay([])
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
            { "id": "LockDept", "pId": "root", "name": "冻结部门列表"}/*,
            { "id": "Log", "pId": "root", "name": "特殊操作日志"}*/
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

    /******************************操作栏相关**********************************/
    /**
     * 操作栏显示隐藏公共方法
     * @param arr
     */
    var toolbarDisplay = function(arr){
        //隐藏全部按钮
        $("#org_toolbar>button").css({"display":"none"});
        //默认显示组织配置、查询
        $("#btn_orgConfig").css({"display":"inline-block"});
        $("#btn_search").css({"display":"inline-block"});
        //显示指定id按钮
        for(var i= 0,id;id=arr[i++];){
            $("#"+id).css({"display":"inline-block"});
        }
    };

    /**
     * 所有主面板上的事件初始化
     */
    var clickInit = function(){
        /******************************页签切换事件绑定**********************************/
        $("#li_orgTab").click(function(){
            //显示组织导入、人员导入
            toolbarDisplay(["btn_importOrg","btn_importPerson"]);
        });
        $("#li_roleTab").click(function(){
            //显示角色目录导入、角色导入
            toolbarDisplay(["btn_importRoleDir","btn_importRole"]);
        });
        $("#li_configTab").click(function(){
            //隐藏所有
            toolbarDisplay([]);
        });
        /******************************操作栏事件绑定**********************************/
        $("#btn_orgConfig").click(function(){ Config.showConfigSidebar() });
        $("#btn_importOrg").click(function(){ Dept.importDept() });
        $("#btn_importPerson").click(function(){ User.importPerson() });
        $("#btn_importRoleDir").click(function(){ RoleDir.importRoleDir() });
        $("#btn_importRole").click(function(){ Role.importRole() });
        $("#btn_importGW").click(function(){ GW.importGW() });
        $("#btn_importZW").click(function(){ ZW.importZW() });
        $("#btn_editDept").click(function(){ Dept.editDept() });
        $("#btn_addDept").click(function(){ Dept.addDept() });
        $("#btn_addPerson").click(function(){ User.addPerson() });
        $("#btn_editRoleDir").click(function(){ RoleDir.editRoleDir() });
        $("#btn_addRoleDir").click(function(){ RoleDir.addRoleDir() });
        $("#btn_delRoleDir").click(function(){ RoleDir.delRoleDir() });
        $("#btn_addRole").click(function(){ Role.addRole() });
        $("#btn_delRole").click(function(){ Role.delRole() });
        $("#btn_addGW").click(function(){ GW.addGW() });
        $("#btn_delGW").click(function(){ GW.delGW() });
        $("#btn_addZW").click(function(){ ZW.addZW() });
        $("#btn_delZW").click(function(){ ZW.delZW() });
        $("#btn_search").click(function(){
            $("#orgMainId").show();
            $("#orgMainContent").empty();
            $("#orgShowListPanel").hide();
        });
    };

    //主面板初始化
    var mainContentInit = function(){
        $("#orgSearchTypeSelect").change(function(e){
            var orgSearchText = $("#orgSearchText");
            switch (e.target.value){
                case "user":
                    orgSearchText.attr("placeholder","姓名|编号|部门名称");
                    break;
                case "dept":
                    orgSearchText.attr("placeholder","部门名称|编号");
                    break;
                case "role":
                    orgSearchText.attr("placeholder","角色名称|编号");
                    break;
            }
        });

        //表格的默认配置
        var defaultConfig = {
            placeAt:"orgMainContent",
            pageSize:10
        };

        //查询按钮事件绑定
        $("#orgSearchBtn").click(function(){
            //清空面板
            $("#orgMainContent").empty();
            var serachVal = $("#orgSearchText").val();
            var sType = $("#orgSearchTypeSelect option:selected").val();
            switch (sType){
                case "user":
                    User.showPersonList("getUserMhForGrid?param="+serachVal,defaultConfig);
                    break;
                case "dept":
                    Dept.showDeptList("getDeptMhForGrid?param="+serachVal,defaultConfig);
                    break;
                case "role":
                    Role.showRoleList("getRoleMhForGrid?param="+serachVal,defaultConfig);
                    break;
            }
        });
        //为输入框绑定回车事件
        $('#orgSearchText').bind('keypress',function(event){
            if(event.keyCode == "13"){
                $("#orgSearchBtn").click();
            }
        });
        //默认查询出所有人员
        //User.showPersonList("getAllUserForGrid",defaultConfig);
    };

    /**
     * 主页初始化
     */
    var orgMainInit = function(){
        //默认显示组织导入、人员导入
        toolbarDisplay(["btn_importOrg","btn_importPerson"]);
        //创建部门树
        createDeptTree($("#orgtree"));
        //创建角色树
        createRoleTree($("#roletree"));
        //创建高级功能树
        createConfigTree($("#orgConfigTree"));
        //初始化主面板（查询功能）
        mainContentInit();
        //事件初始化
        clickInit();
    };

    return {
        orgMainInit:orgMainInit
    }
});