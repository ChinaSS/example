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
                            //显示组织相关操作
                            toolbarDisplay(["btn_importOrg","btn_importPerson","btn_editDept","btn_addDept","btn_addPerson"])
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
                            //单击节点展开
                            $.fn.zTree.getZTreeObj("roletree").expandNode(treeNode);
                            //显示角色相关操作
                            toolbarDisplay(["btn_importRoleDir","btn_importRole","btn_editRoleDir","btn_addRoleDir","btn_addRole"])
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

                    //显示相关操作
                    if(treeNode.id=="GWConfig"){
                        toolbarDisplay(["btn_importGW","btn_addGW"]);       //显示岗位导入、新增岗位
                    }else if(treeNode.id=="ZWConfig"){
                        toolbarDisplay(["btn_importZW","btn_addZW"]);       //显示职位导入、新增职务
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
                    editPerson(e.data.row.UserCode);
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
                        editRole(e.data.row.roleCode);
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
                        editGW(e.data.row.gwCode);
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
                        editZW(e.data.row.zwCode);
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
    //弹出组织配置
    var showConfigSidebar = function(){
        util.slidebar({
            url:getStaticPath()+"/core/system/org/views/orgConfig.html",
            close:true,
            width:"500px"
        });
    };
    //弹出人员侧边栏
    var showPersonSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgPerson.html",
            cache:false,
            close:true,
            width:"800px"
        },param));
    };
    //弹出部门侧边栏
    var showDeptSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgDept.html",
            cache:false,
            close:true,
            width:"800px"
        },param));
    };
    //弹出角色目录侧边栏
    var showRoleDirSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgRoleDir.html",
            cache:false,
            close:true,
            width:"500px"
        },param));
    };
    //弹出角色侧边栏
    var showRoleSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgRole.html",
            cache:false,
            close:true,
            width:"500px"
        },param));
    };
    //弹出岗位侧边栏
    var showGWSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgGW.html",
            //id:"EditGWPanel",
            cache:false,
            close:true,
            width:"500px"
        },param));
    };
    //弹出职务侧边栏
    var showZWSidebar = function(param){
        util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgZW.html",
            //id:"EditZWPanel",
            cache:false,
            close:true,
            width:"500px"
        },param));
    };

    /******************************操作栏相关**********************************/
    /**
     * 操作栏显示隐藏公共方法
     * @param arr
     */
    var toolbarDisplay = function(arr){
        //隐藏全部按钮(第一个组织配置除外)
        $("#org_toolbar>button").not(":first").css({"display":"none"});
        //默认显示组织配置
        $("#btn_orgConfig").css({"display":"inline-block"});
        //显示指定id按钮
        for(var i= 0,id;id=arr[i++];){
            $("#"+id).css({"display":"inline-block"});
        }
    };

    $("#btn_orgConfig").click(function(){ showConfigSidebar() });
    $("#btn_importOrg").click(function(){ importOrg() });
    $("#btn_importPerson").click(function(){ importPerson() });
    $("#btn_importRoleDir").click(function(){ importRoleDir() });
    $("#btn_importRole").click(function(){ importRole() });
    $("#btn_importGW").click(function(){ importGW() });
    $("#btn_importZW").click(function(){ importZW() });
    $("#btn_editDept").click(function(){ editDept() });
    $("#btn_addDept").click(function(){ addDept() });
    $("#btn_addPerson").click(function(){ addPerson() });
    $("#btn_editRoleDir").click(function(){ editRoleDir() });
    $("#btn_addRoleDir").click(function(){ addRoleDir() });
    $("#btn_addRole").click(function(){ addRole() });
    $("#btn_addGW").click(function(){ addGW() });
    $("#btn_addZW").click(function(){ addZW() });


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


    /******************************组织相关**********************************/
    /**
     * 取得选择的树节点id
     * @param id
     * @returns {*}
     */
    var getSelectTreeNodeId = function(id){
        var nodes = $.fn.zTree.getZTreeObj(id).getSelectedNodes();
        return nodes.length?nodes[0].id : false
    };
    var getSelectTreeNodeName = function(id){
        var nodes = $.fn.zTree.getZTreeObj(id).getSelectedNodes();
        return nodes.length?nodes[0].name : false
    };

    //组织导入
    var importOrg = function(){
        var mapping = {
            "ServiceBeanName":"OrgDeptService",
            "ServiceMethodName":"importDept",
            "EntityClassName":"com.css.org.entity.OrgDept",
            "部门ID":"deptId","部门编号":"deptCode","部门名称":"deptName","部门领导":"leader","部门领导编号":"leaderCode",
            "管理人员":"manager","管理人员编号":"managerCode","成本中心代码":"costCenterCode","部门级别":"level",
            "显示序号":"sort","所属部门名称":"pDeptName","所属部门ID":"pDeptId","部门OU":"ou",
            "部门信息1":"extend1","部门信息2":"extend2","部门信息3":"extend3","部门信息4":"extend4",
            "部门信息5":"extend5","部门信息6":"extend6","部门信息7":"extend7","部门信息8":"extend8",
            "部门信息9":"extend9","部门信息10":"extend10","部门信息11":"extend11","部门信息12":"extend12",
            "部门信息13":"extend13","部门信息14":"extend14","部门信息15":"extend15","部门信息16":"extend16",
            "部门信息17":"extend17","部门信息18":"extend18","部门信息19":"extend19","部门信息20":"extend20"
        };
        importExcel({
            "title":"组织导入",
            "templeteURL":sysPath+"/org/views/importDept.html",
            "mapping":mapping
        });
    };
    //人员导入
    var importPerson = function(){
            var mapping = {
                "ServiceBeanName":"OrgUserService",
                "ServiceMethodName":"importUser",
                "EntityClassName":"com.css.org.entity.OrgUser",
                "员工编号":"userCode","用户名称":"userName","性别":"sex","生日":"birthday","办公电话":"officePhone",
                "移动电话":"phone","传真":"fax","邮箱":"email","职务名称":"zw",
                "职务编号":"zwCode","显示序号":"sort","是否冻结":"locked",
                "所属部门":"deptName","部门ID":"deptId","兼职部门":"jzDeptName","兼职部门ID":"jzDeptId",
                "人员信息1":"extend1","人员信息2":"extend2","人员信息3":"extend3","人员信息4":"extend4",
                "人员信息5":"extend5","人员信息6":"extend6","人员信息7":"extend7","人员信息8":"extend8",
                "人员信息9":"extend9","人员信息10":"extend10","人员信息11":"extend11","人员信息12":"extend12",
                "人员信息13":"extend13","人员信息14":"extend14","人员信息15":"extend15","人员信息16":"extend16",
                "人员信息17":"extend17","人员信息18":"extend18","人员信息19":"extend19","人员信息20":"extend20"
            };
            importExcel({
                "title":"人员导入",
                "templeteURL":sysPath+"/org/views/importPerson.html",
                "mapping":mapping
            });
    };

    //部门侧边栏操作按钮显示隐藏控制
    var orgSidebarTools = function(){
        $("#tab_DeptBaseInfo").click(function(){
            $("#btn_orgDetpAddPerson").hide();
            $("#btn_orgAddGW").hide();
        });
        $("#tab_DeptMembers").click(function(){
            $("#btn_orgDetpAddPerson").show();
            $("#btn_orgAddGW").hide();
        });
        $("#tab_DeptGWInfo").click(function(){
            $("#btn_orgDetpAddPerson").hide();
            $("#btn_orgAddGW").show();
        });
        $("#tab_DeptExtendInfo").click(function(){
            $("#btn_orgDetpAddPerson").hide();
            $("#btn_orgAddGW").hide();
        })
    };
    //部门编辑
    var editDept = function(){
        var deptId = getSelectTreeNodeId("orgtree");
        //获取当前需要编辑的部门对象数据
        $.ajax({
            url:sysPath+"/org/data/Dept.json",
            dataType:"json",
            success:function(data){
                //弹出部门编辑侧边栏
                showDeptSidebar({
                    afterLoad:function(){
                        $("#org_deptName").html(data.Org.Dept.DeptInfo.BaseInfo.deptName);
                        $("#org_deptId").html(data.Org.Dept.DeptInfo.BaseInfo.deptId);
                        setNgModel("DeptBaseInfo",data);
                        setNgModel("DeptExtendInfo",data);
                        //人员列表
                        document.getElementById("T_DeptMembers").outerHTML = util.template("T_DeptMembers",data);
                        //岗位列表
                        document.getElementById("T_GWList").outerHTML = util.template("T_GWList",data);
                        //页签切换时控制操作按钮的显示隐藏
                        orgSidebarTools();
                    }
                });
            }
        });

    };
    //新增部门
    var addDept = function(){
        var deptNode = $.fn.zTree.getZTreeObj("orgtree").getSelectedNodes();
        showDeptSidebar({
            afterLoad:function(){
                $("#pDeptName").val(deptNode[0].name);
                $("#pDeptId").val(deptNode[0].id);
                orgSidebarTools();
            }
        });
    };

    //新增人员
    var addPerson = function(){

        showPersonSidebar({
            afterLoad: function(){
                initZW();
            }
        });
    };
    //人员编辑
    var editPerson = function(userCode){
        //更新当前编辑人员scope
        /*$http.get('lib/core/org/data/Person.json').success(function(data) {
            //更新职务对象
            for(var i= 0,item;item=$scope.$parent.Org.Person.ZWList[i++];){
                data.PersonInfo.BaseInfo.ZW.id==item.id ? data.PersonInfo.BaseInfo.ZW=item :"";
            }
            $scope.$parent.Org.Person = $.extend($scope.$parent.Org.Person,data);
        });*/

        //获取当前需要编辑的人员对象数据
        $.ajax({
            url:sysPath+"/org/data/Person.json",
            dataType:"json",
            success:function(data){
                showPersonSidebar({
                    afterLoad:function(){
                        $("#org_PersonName").html(data.Org.Person.PersonInfo.BaseInfo.userName);
                        $("#org_PersonDeptName").html(data.Org.Person.PersonInfo.DeptInfo.deptName);
                        setNgModel("PersonBaseInfo",data);
                        //职务初始化
                        initZW(data.Org.Person.PersonInfo.BaseInfo.ZW);
                        //性别与是否冻结
                        $("input[type='radio'][name='sex'][value='"+data.Org.Person.PersonInfo.BaseInfo.sex+"']").attr("checked", "checked");
                        $("input[type='radio'][name='locked'][value='"+data.Org.Person.PersonInfo.BaseInfo.locked+"']").attr("checked", "checked");
                        setNgModel("PersonExtendInfo",data);
                        //所属角色
                        document.getElementById("T_PersonRoles").outerHTML = util.template("T_PersonRoles",data);
                        //所属岗位
                        document.getElementById("T_PersonGW").outerHTML = util.template("T_PersonGW",data);

                    }
                });
            }
        });
    };

    //职务初始化
    var initZW = function(val){
        $.ajax({
            url:sysPath+"/org/data/ZWList.json",
            dataType:"json",
            success:function(data){
                var sel = $("#sle_PersonZW");
                //初始化人员操作界面的职务选择下拉
                for(var i= 0,item;item=data[i++];){
                    sel.append('<option value="'+item.id+'">'+item.name+'</option>');
                }
                //设置选中值
                val && sel.val(val);
            }
        })
    };

    /*****************角色相关**************/
    //角色目录导入
    var importRoleDir = function(){
        var mapping = {
            "ServiceBeanName":"OrgRoleDirService",
            "ServiceMethodName":"importRoleDir",
            "EntityClassName":"com.css.org.entity.OrgRoleDir",
            "目录名称":"dirName","目录编号":"dirCode","父目录编号":"pDirCode"
        };
        importExcel({
            "title":"角色目录导入",
            "templeteURL":sysPath+"/org/views/importRoleDir.html",
            "mapping":mapping
        });
    };
    //角色导入
    var importRole = function(){
        var mapping = {
            "ServiceBeanName":"OrgRoleService",
            "ServiceMethodName":"importRole",
            "EntityClassName":"com.css.org.entity.OrgRole",
            "角色编号":"roleCode","角色名称":"roleName","管理人员编号":"managerCode",
            "所属目录编号":"dirCode","序号":"sort"
        };
        importExcel({
            "title":"角色导入",
            "templeteURL":sysPath+"/org/views/importRole.html",
            "mapping":mapping
        });
    };
    //编辑角色目录
    var editRoleDir = function(){
        var deptId = getSelectTreeNodeId("roletree");
        $.ajax({
            url:sysPath+"/org/data/RoleDir.json",
            dataType:"json",
            success:function(data){
                showRoleDirSidebar({
                    afterLoad:function(){
                        $("#org_RoleDirName").html(data.Org.RoleDir.dirName);
                        setNgModel("tab_RoleDir",data);
                    }
                });
            }
        });
    };
    //新增角色目录
    var addRoleDir = function(){
        showRoleDirSidebar();
    };
    //新增角色
    var addRole = function(){
        showRoleSidebar();
    };
    //编辑角色
    var editRole = function(roleCode){
        $.ajax({
            url:sysPath+"/org/data/Role.json",
            dataType:"json",
            success:function(data){
                showRoleSidebar({
                    afterLoad:function(){
                        $("#org_RoleName").html(data.Org.Role.roleName);
                        setNgModel("tab_Role",data);
                    }
                });
            }
        });
    };

    /*****************岗位相关**************/
    //岗位导入
    var importGW = function(){
        var mapping = {
            "ServiceBeanName":"OrgGwService",
            "ServiceMethodName":"importGw",
            "EntityClassName":"com.css.org.entity.OrgGw",
            "岗位名称":"gwName","岗位编号":"gwCode","显示序号":"sort"
        };
        importExcel({
            "title":"岗位导入",
            "templeteURL":sysPath+"/org/views/importGW.html",
            "mapping":mapping
        });
    };
    //新增岗位
    var addGW = function(){
        showGWSidebar();
    };
    //编辑岗位
    var editGW = function(GWCode){
        $.ajax({
            url:sysPath+"/org/data/GW.json",
            dataType:"json",
            success:function(data){
                showGWSidebar({
                    afterLoad:function(){
                        $("#org_GWName").html(data.Org.GW.gwName);
                        setNgModel("tab_GW",data);
                    }
                });
            }
        });
    };

    /*****************职务相关**************/
    //职务导入
    var importZW = function(){
        var mapping = {
            "ServiceBeanName":"OrgZwService",
            "ServiceMethodName":"importZw",
            "EntityClassName":"com.css.org.entity.OrgZw",
            "职务名称":"zwName","职务编号":"zwCode","显示序号":"sort"
        };
        importExcel({
            "title":"职务导入",
            "templeteURL":sysPath+"/org/views/importZW.html",
            "mapping":mapping
        });
    };
    //新增职务
    var addZW = function(){
        showZWSidebar();
    };
    //编辑职务
    var editZW = function(){
        $.ajax({
            url:sysPath+"/org/data/ZW.json",
            dataType:"json",
            success:function(data){
                showZWSidebar({
                    afterLoad:function(){
                        $("#org_ZWName").html(data.Org.ZW.zwName);
                        setNgModel("tab_ZW",data);
                    }
                });
            }
        });
    };


    /**
     * Excel导入前端公共接口
     * @param param
     */
    var importExcel = function(param){
        require(["UtilDir/dialog",
                "WebUploader",
                "text!"+param.templeteURL,
                "css!WebUploaderCss"
            ],
            function(Dialog,WebUploader,body){
                var dialog = Dialog({
                    id:"system_importExcelDialog",
                    title:param.title,
                    cache:false,
                    body:body
                });
                //附件上传控件初始化
                var uploader = WebUploader.create({
                    swf:getStaticPath()+'/modules/webuploader/Uploader.swf',
                    server: getServer()+"/util/v1/excel",
                    accept:{
                        title:"excel",
                        //extensions: 'xsl,xslx',
                        mimeTypes:["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].join(",")
                    },
                    pick:{
                        id:'#ImportExcelPanel',
                        multiple:false
                    }
                });
                //设置上传按钮
                dialog.setFoot([{name:"开始上传",callback:function(){
                    uploader.upload();
                }}]);
                //设置样式，必须uploader初始化后才能设置
                var panel = $("#ImportExcelPanel");
                panel.children(":first").css({
                    "width": "100px",
                    "height": "25px",
                    "padding": "3px"
                });
                panel.children(":last").css({"background": "#00b7ee"});
                panel.find("label").hover(function() {
                    panel.children(":last").css({"background": "#00b7ee"});
                }, function() {
                    panel.children(":last").css({"background": "#00a2d4"});
                });
                //把附件增加到待上传列表中
                uploader.on( 'fileQueued', function(file) {
                    $("#importExcelInfo").show();
                    $("#importExcelFileName").html(file.name);
                });
                //附件上传数据发送之前触发
                uploader.on( 'uploadBeforeSend', function(object,data,headers) {
                    data["formData"] = JSON.stringify(param.mapping);
                    $("#importExcelStatus").html("开始导入，请耐心等待...");
                });
                //附件上传成功后触发
                uploader.on( 'uploadSuccess', function( file,response ) {
                    $("#importExcelStatus").html(response.status=="success"?"导入成功,共"+response.count+"条":"导入失败");
                    //错误信息
                    var errorInfo = response.excelTransformInfo?"<strong>Excel转换错误信息：</strong><br/>"+decodeURI(response.excelTransformInfo):"";
                    errorInfo+= response.importInfo?"<strong>导入错误信息：</strong><br/>"+decodeURI(response.importInfo):"";
                    $("#importExcelErrorInfo").html(errorInfo);
                });
            }
        );
    };

    var setNgModel = function(id,data){
        //得到指定id面板中所有需要绑定的文本框对象
        $("#"+id+" input[type='text'][ng-model]").each(function(index){
            var arr = $(this).attr("ng-model").split(".");
            var temp=data;
            for(var i= 0,item;item=arr[i++];){
                temp = temp[item];
            }
            $(this).val(temp);
        });
    };

    var getNgModel = function(){

    };

    /**
     * 主页初始化
     */
    var orgMainInit = function(){
        //默认显示组织导入、人员导入
        toolbarDisplay(["btn_importOrg","btn_importPerson"]);
        createDeptTree($("#orgtree"));
        createRoleTree($("#roletree"));
        createConfigTree($("#orgConfigTree"));
    };

    return {
        orgMainInit:orgMainInit
    }
});