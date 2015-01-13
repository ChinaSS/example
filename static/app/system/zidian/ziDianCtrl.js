define(["jquery","UtilDir/util","ZiDianDir/ziDianSupport"],function($,util,support){
    return function($compile,$scope){
        $scope.$apply(function () {
            $scope.data = {
            	"entity" : {},
                "template": {
                    "edit": getStaticPath() + "app/system/zidian/views/zidianEdit.html"
                },
                "saveEntity": function () {
                    support.saveEntity($scope);
                },
                "delEntity": function () {
                    support.delEntity($scope);
                },
                "scopeTest": function () {
                   $scope.typeahead.value="2";
                }
            };
            $scope.dialog = {
                initConfig : {
                    setting: {
                        title : "dialog",
                        drag:true,
                        modal:{
                            backdrop:"static"
                        },
                        buttons:[
                            {
                                name:'确定',
                                callback:function(dialog){
                                    console.log(dialog);
                                    dialog.save();
                                    dialog.hide();
                                }
                            }
                        ]
                    },
                    template : getStaticPath()+"app/system/zidian/views/scopeTest.html"
                },
                value : {
                    id: "1",
                    name:"2222"
                }
            };
            $scope.input = {
                value : "1,2",
                initConfig : {
                    type : "checkbox",
                    searchAble: true,
                    data : [
                        {id:"1",name:"test1"},
                        {id:"2",name:"test2"},
                        {id:"3",name:"test3"},
                        {id:"4",name:"test4"}
                    ],
                    callback : function(data){
                        console.log(data);
                    }
                },
                date : "2014-12-1 12:34:21"
            };
            $scope.input1 = {
                value : "1",
                initConfig : {
                    type : "select",
                    data : [
                        {id:"1",name:"test1"},
                        {id:"2",name:"test2"},
                        {id:"3",name:"test3"},
                        {id:"4",name:"test4"}
                    ],
                    callback : function(data){
                        console.log(data);
                    }
                },
                date : "2014-12-1 12:34:21"
            };
            $scope.typeahead = {
                value : "1",
                initConfig : {
                    data : [
                        {id:"1",data:"test1"},
                        {id:"2",data:"test2"},
                        {id:"3",data:"test3"},
                        {id:"4",data:"test4"}
                    ],
                    onSelect : function(data,setElement){
                        setElement("<a>"+data.data+"</a>",data.id);
                        console.log(data);
                    }
                }

            };
            $scope.typeahead1 = {
                value : "2",
                initConfig : {
                    data : [
                        {id:"1",data:"test1"},
                        {id:"2",data:"test2"},
                        {id:"3",data:"test3"}
                    ],
                    onSelect : function(data,setElement){
                        setElement("<a>"+data.data+"</a>",data.id);
                        console.log(data);
                    }
                }
            };
            support.setSelectEntity($scope);
            support.menuTreeInit($scope);
            support.gridInit("DICT_TYPE", $scope);
        });
    }
});