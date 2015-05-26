/**
 * Created by YiYing on 2015/3/25.
 */
define(["PDUtilDir/util","PDUtilDir/tool","PDUtilDir/dialog","PDOrgDir/util","PDUtilDir/grid","PDUtilDir/org/orgSelect"],function(Util,Tool,Dialog,OrgUtil,Grid,OrgSelect){

    var _psn    = [];   //原有人员
    var _psnNew = [];   //修改后的人员
    var _gw     = [];   //原有岗位
    var _gwNew  = [];   //修改后的岗位

    //部门导入
    var importDept = function(){
        var mapping = {
            "ServiceName":"org/dept/importDept",
            "EntityClassName":"com.css.sword.org.entity.OrgDept",
            "部门编号":"deptCode","部门名称":"deptName","部门领导":"leader","部门领导编号":"leaderCode",
            "管理人员":"manager","管理人员编号":"managerCode","成本中心名称":"costCenterName","成本中心代码":"costCenterCode","部门级别":"level",
            "显示序号":"sort","部门树ID":"deptTreeId","所属部门树ID":"pDeptTreeId","部门OU":"ou",
            "部门信息1":"extend1","部门信息2":"extend2","部门信息3":"extend3","部门信息4":"extend4",
            "部门信息5":"extend5","部门信息6":"extend6","部门信息7":"extend7","部门信息8":"extend8",
            "部门信息9":"extend9","部门信息10":"extend10","部门信息11":"extend11","部门信息12":"extend12",
            "部门信息13":"extend13","部门信息14":"extend14","部门信息15":"extend15","部门信息16":"extend16",
            "部门信息17":"extend17","部门信息18":"extend18","部门信息19":"extend19","部门信息20":"extend20"
        };
        OrgUtil.importExcel({
            "title":"组织导入",
            "templeteURL":OrgUtil.sysPath+"/org/views/importDept.html",
            "mapping":mapping
        });
    };

    //部门侧边栏操作按钮显示隐藏控制
    var orgSidebarTools = function(){
        $("#tab_DeptBaseInfo").click(function(){
            $("#btn_orgDetpAddPerson").hide();
        });
        $("#tab_DeptMembers").click(function(){
            $("#btn_orgDetpAddPerson").show();
        });
        $("#tab_DeptGWInfo").click(function(){
            $("#btn_orgDetpAddPerson").hide();
        });
        $("#tab_DeptExtendInfo").click(function(){
            $("#btn_orgDetpAddPerson").hide();
        })
    };

    //所有新增和编辑部门时需要绑定的事件
    var allBindInit = function(){
        //页签切换时控制操作按钮的显示隐藏
        orgSidebarTools();
        //新增成员
        addMemberBtnBind();
        //删除成员事件绑定
        delPsnBtnBind();
        //新增岗位
        addGwBtnBind();
        //删除岗位事件绑定
        delGwBtnBind();
        //岗位From人员选择和岗位选择事件绑定
        gwFromBind();
        //新增岗位必填验证
        validateGwForm();
        //保存部门验证
        validateDeptInfo();
        //替换掉扩展字段label
        replaceLabel();
        //部门领导选择
        OrgSelect.CS_SelectPsn({
            id : "DdeptLeader",
            multi : false,
            title : "人员选择",
            tagData : ["user"],
            callback : function(data){
                if(data.user.length){
                    data = data.user[0];
                    $("#DdeptLeader").val(data.userName);
                    $("#DdeptLeaderCode").val(data.userCode);
                }else{
                    $("#DdeptLeader").val("");
                    $("#DdeptLeaderCode").val("");
                }
            }
        });
        //管理人员选择
        OrgSelect.CS_SelectPsn({
            id : "deptManager",
            multi : false,
            title : "人员选择",
            tagData : ["user"],
            callback : function(data){
                if(data.user.length){
                    data = data.user[0];
                    $("#deptManager").val(data.userName);
                    $("#deptManagerCode").val(data.userCode);
                }else{
                    $("#deptManager").val("");
                    $("#deptManagerCode").val("");
                }
            }
        });
        //所属部门选择
        OrgSelect.CS_SelectPsn({
            id : "pDeptName",
            multi : false,
            title : "部门选择",
            tagData : ["dept"],
            callback : function(data){
                if(data.dept.length){
                    data = data.dept[0];
                    $("#pDeptName").val(data.deptName);
                    $("#pDeptCode").val(data.deptCode);
                    $("#pDeptTreeId").val(data.deptTreeId);
                }else{
                    $("#pDeptName").val("");
                    $("#pDeptCode").val("");
                    $("#pDeptTreeId").val("");
                }
            }
        });
    };

    /**
     * 替换掉扩展字段的Label标签值
     */
    var replaceLabel = function(){
        $.ajax({
            url:getServer()+"/sword/org/config/getOrgConfig",
            dataType:"json",
            success:function(data){
                var deptData = data.deptExtendConfig;
                if(deptData){
                    var deptJSON = JSON.parse(deptData)
                    $("#DeptExtendInfoForm label").each(function(index,item){
                        var val = deptJSON[$(item).attr("for").replace("D","")];
                        val && $(item).text(val);
                    })
                }
            }
        });
    };

    //部门编辑
    var editDept = function(uuid){
        var deptUuid = uuid || $.fn.zTree.getZTreeObj("orgtree").getSelectedNodes()[0].deptUuid;
        //获取当前需要编辑的部门对象数据
        $.ajax({
            url:getServer()+"/sword/org/dept/getAllDeptInfoByUuid",
            dataType:"json",
            data:{"deptUuid":deptUuid},
            success:function(data){
                _psn    = data.Members;             //原有人员
                _psnNew = $.extend([],data.Members);
                _gw     = data.GW;                  //原有岗位
                _gwNew  = $.extend([],data.GW);

                //弹出部门编辑侧边栏
                showDeptSidebar({
                    afterLoad:function(){
                        $("#org_deptName").html(data.DeptInfo.deptName);
                        $("#org_deptCode").html(data.DeptInfo.deptCode);
                        //表单数据初始化
                        Tool.deserialize("DeptBaseInfoForm",data.DeptInfo);
                        Tool.deserialize("DeptExtendInfoForm",data.DeptInfo);
                        //人员列表
                        $("#DeptPsnList").empty().append(Util.template("T_DeptMembers",data));
                        //岗位列表
                        $("#DeptGwList").empty().append(Util.template("T_GWList",data));
                        //编辑时部门编号只读
                        $("#DdeptCode").attr("readonly",true);
                        allBindInit();
                        //部门保存
                        saveDeptBtnBind("edit");
                    }
                });
            }
        });
    };

    //部门信息验证
    var validateDeptInfo = function(){
        $("#DeptBaseInfoForm").validate({
            rules:{
                deptName:{required:true},
                deptCode:{
                    required:true,
                    remote:{
                        type:"POST",
                        url: getServer()+"/sword/org/dept/validateDeptCode",
                        data:{
                            deptCode:function(){return $("#deptCode").val();},
                            deptUuid:function(){return $("#deptUuid").val();}
                        }
                    }
                }
            },
            messages: {
                deptCode:{
                    remote:"部门编号已存在,请重新输入"
                }
            }
        });
    };

    //部门保存
    var saveDeptBtnBind = function(saveType){
        $("#btn_orgDetpSave").click(function(){
            if(!$("#DeptBaseInfoForm").valid()){
                return;
            }
            //岗位转换，把一条岗位记录拆为后端的两张表，方便后端转换为对应实体
            var gwZH = function(gwList){
                var orgDeptGw = [],orgDeptGwUser=[];
                for(var i= 0,m;m=gwList[i++];){
                    var arr = m.gwMembersUuid.split(";");
                    var uuid = m.deptGwUserUuid?m.deptGwUserUuid.split(";"):[];
                    for(var j= 0;j<arr.length;j++){
                        var userUuid = arr[j];
                        if(userUuid!=""){
                            orgDeptGwUser.push({
                                "uuid":uuid[j]||"",
                                "gwUuid": m.gwUuid,
                                "userUuid":userUuid
                            })
                        }
                    }
                    orgDeptGw.push({
                        "uuid": m.uuid||"",
                        "gwUuid": m.gwUuid,
                        "extend": m.gwExtend
                    })
                }
                return {
                    "orgDeptGw":orgDeptGw,
                    "orgDeptGwUser":orgDeptGwUser
                }
            };

            var addGwZh = gwZH(Tool.jsonArrayIntersection(_gwNew,_gw,gwAndUserRule));
            var delGwZh = gwZH(Tool.jsonArrayIntersection(_gw,_gwNew,gwAndUserRule));
            var dept = $.extend(Tool.serialize("DeptBaseInfoForm"),Tool.serialize("DeptExtendInfoForm"));
            var data = {
                "dept": JSON.stringify(dept),
                "addPsn":JSON.stringify(Tool.jsonArrayIntersection(_psnNew,_psn,psnRule)),
                "delPsn":JSON.stringify(Tool.jsonArrayIntersection(_psn,_psnNew,psnRule)),
                "addDeptGw":JSON.stringify(addGwZh.orgDeptGw),
                "addDeptGwUser":JSON.stringify(addGwZh.orgDeptGwUser),
                "delDeptGw":JSON.stringify(delGwZh.orgDeptGw),
                "delDeptGwUser":JSON.stringify(delGwZh.orgDeptGwUser)
            };

            //console.log(data);
            //return false;

            $.ajax({
                url:getServer()+"/sword/org/dept/saveDept",
                dataType:"json",
                data:data,
                success:function(data){
                    if(data.status){
                        //刷新树
                        var tree = $.fn.zTree.getZTreeObj("orgtree");
                        var curNode = tree.getSelectedNodes()[0];
                        if(saveType=="insert"){
                            tree.addNodes(curNode,{"name": dept.deptName,"deptCode":dept.deptCode,"deptUuid":data.deptUuid});
                        }
                        if(saveType=="edit"){
                            //curNode.name = dept.deptName;
                            alert(data.message);
                            //刷新页面更新部门树
                            location.reload();
                        }
                        tree.updateNode(curNode);
                    }
                    Util.alert(data.message);
                }
            })
        });
    };

    var psnRule = function(one,two){
        return one.userUuid==two.userUuid?true:false;
    };

    /**
     * 删除人员事件绑定
     */
    var delPsnBtnBind = function(){
        $("#DeptPsnList").bind("click",function(e){
            if(e.target.tagName.toLowerCase()=="i"){
                var $curTrTds = $(e.target.parentNode.parentNode).find("td");
                var index = Tool.indexOfJsonArray({"userUuid":$curTrTds[0].innerText},_psnNew,psnRule);
                _psnNew.splice(index,1);
                //重新渲染表格
                $("#DeptPsnList").empty().append(Util.template("T_DeptMembers",{"Members":_psnNew}))
            }
        });
    };

    //新增成员
    var addMemberBtnBind = function(){
        OrgSelect.CS_SelectPsn({
            id : "btn_orgDetpAddPerson",
            multi : true,
            title : "人员选择",
            dataRefill: false,
            tagData : ["user"],
            callback : function(data){
                data = data.user;
                if(data.length){
                    for(var i= 0,item;item=data[i++];){
                        if(Tool.indexOfJsonArray(item,_psnNew,psnRule)==-1){
                            _psnNew.push(item)
                        }
                    }
                    $("#DeptPsnList").empty().append(Util.template("T_DeptMembers",{"Members":_psnNew}))
                }
            }
        });
    };

    /**
     * 自定义两个json对象的校验规则
     * @param one
     * @param two
     * @returns {boolean}
     */
    var gwRule = function(one,two){
        return one.gwUuid==two.gwUuid?true:false;
    };

    var gwAndUserRule = function(one,two){
        //岗位UUID和该岗位下对应的人员一致时才相等
        return (one.gwUuid==two.gwUuid && one.gwMembersUuid==two.gwMembersUuid)?true:false;
    };

    /**
     * 新增岗位必填项验证
     */
    var validateGwForm = function(){
        //数据验证
        $("#DeptGWInfoForm").validate({
            rules:{
                gwCode:{required:true},
                gwMembers:{required:true}
            },
            messages: {
                gwCode:"请选择岗位",
                gwMembers:"请选择人员"
            }
        });
    };

    //新增岗位事件绑定
    var addGwBtnBind = function(){
        $("#addDeptGwBtn").bind("click",function(){
            if($("#DeptGWInfoForm").valid()){
                var data = Tool.serialize("DeptGWInfoForm");
                if(Tool.indexOfJsonArray(data,_gwNew,gwRule)==-1){
                    _gwNew.push(data)
                }else{
                    Util.alert("岗位<code>"+data.gwName+"</code>已经在列表中.");
                }
                $("#DeptGwList").empty().append(Util.template("T_GWList",{"GW":_gwNew}));
                //清空数据
                $("#DeptGWInfoForm")[0].reset();
            }
        });
    };

    //删除岗位
    var delGwBtnBind = function(){
        $("#DeptGwList").bind("click",function(e){
            if(e.target.tagName.toLowerCase()=="i"){
                var $curTrTds = $(e.target.parentNode.parentNode).find("td");
                var index = Tool.indexOfJsonArray({"gwUuid":$curTrTds[0].innerText},_gwNew,gwRule);
                _gwNew.splice(index,1);
                //重新渲染表格
                $("#DeptGwList").empty().append(Util.template("T_GWList",{"GW":_gwNew}));
            }
        });
    };


    var gwFromBind = function(){
        //选择岗位
        $("#gwCode").bind("click",function(){
            //为弹出框增加操作按钮
            var buttons = [];
            buttons.push(
                {name:"确定",callback:function(){
                    var data = Grid.getGrid("SelectGwGrid").getSelectedRow()[0];
                    $("#gwCode").val(data.gwCode);
                    $("#gwUuid").val(data.gwUuid);
                    $("#gwName").val(data.gwName);
                    dialog.hide();
                }}
            );
            var dialog = Dialog({
                id:"DeptSelectGw",
                cache:false,                 //是否缓存，默认为true
                title:"岗位选择",
                width:"520px",
                body:'<div id="DeptSelectGwGrid"></div>',
                buttons:buttons
            });
            //岗位列表
            var config = {
                placeAt:"DeptSelectGwGrid",        //存放Grid的容器ID
                pageSize:10,                          //一页多少条数据
                id: "SelectGwGrid",
                index:"radio",
                layout: [
                    {name: "岗位编号", field: "gwCode"},
                    {name: "岗位名称", field: "gwName"},
                    {name: "序号", field: "sort"}
                ],
                data: {
                    "type": "URL",
                    "value": getServer() + "/sword/org/gw/getAllGwForGrid"
                }
            };
            Grid.init(config);
            dialog.show();
        });
        //选择人员
        OrgSelect.CS_SelectPsn({
            id : "gwMembers",
            multi : true,
            title : "人员选择",
            dataRefill: false,
            tagData : ["user"],
            callback : function(data){
                data = data.user;
                if(data.length){
                    var psn="",psnCode="",psnUuid="";
                    for(var i= 0,item;item=data[i++];){
                        psn+= item.userName+"/"+item.userCode+";";
                        psnCode+= item.userCode+";";
                        psnUuid+= item.userUuid+";";
                    }
                    $("#gwMembers").val(psn);
                    $("#gwMembersCode").val(psnCode);
                    $("#gwMembersUuid").val(psnUuid);
                }else{
                    $("#gwMembers").val("");
                    $("#gwMembersCode").val("");
                    $("#gwMembersUuid").val("");
                }

            }
        });
    };

    //新增部门
    var addDept = function(){
        var deptNode = $.fn.zTree.getZTreeObj("orgtree").getSelectedNodes();
        showDeptSidebar({
            afterLoad:function(){
                $("#pDeptName").val(deptNode[0].name);
                $("#pDeptTreeId").val(deptNode[0].id);
                allBindInit();
                //部门保存
                saveDeptBtnBind("insert");
            }
        });
    };

    //弹出部门侧边栏
    var showDeptSidebar = function(param){
        Util.slidebar($.extend({
            url:getStaticPath()+"/core/system/org/views/orgDept.html",
            cache:false,
            close:true,
            width:"800px"
        },param));
    };

    /**
     * 显示部门列表
     */
    var showDeptList = function(serviceName,extendCofig){
        var config = {
            id: "OrgAllDeptList",
            layout: [
                {
                    name: "部门名称", field: "deptName", click: function (e) {
                    //console.log(e.data);
                    editDept(e.data.row.deptUuid);
                }
                },
                {name: "部门编号", field: "deptCode"},
                {name: "部门领导", field: "leader"},
                {name: "所属组织", field: "pDeptName"},
                {name: "序号", field: "sort"}
            ],
            data: {
                "type": "URL",
                //"value": sysPath + "/org/data/AllDept.json"
                "value": getServer() +"/sword/org/dept/"+serviceName
            }
        };
        Grid.init($.extend(config,extendCofig||OrgUtil.gridDefaultConfig));
    };

    return {
        importDept:importDept,
        editDept:editDept,
        addDept:addDept,
        showDeptList:showDeptList
    }
});