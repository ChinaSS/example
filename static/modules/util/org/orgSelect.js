/**
 * Created by YiYing on 2015/2/10.
 */
define(["UtilDir/org/dataSelect"],function(DataSelect){
    /**
     * 数据选择接口
     * @param param
     * @constructor
     */
    var CS_SelectPsn = function(param){
        var _param = $.extend({
            multi : false,
            hideTag : false,
            tagData : []
        },param);
        $("#"+param.id).on("click",function(){
            DataSelect(_param);
        });
    };

    function getSelectPsn(id){
        return DataSelect.getData(id);
    }

    return {
        CS_SelectPsn : CS_SelectPsn,
        CS_getSelectPsn : getSelectPsn
    }
});