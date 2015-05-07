define(["jquery"],function(){
    /**
     * 判断两个json对象是否值相等，目前只支持一级
     * @param one
     * @param two
     * @returns {boolean}
     */
    var jsonEqual = function(one,two){
        var result = true;
        for(var k in one){
            if(one[k]!=two[k]){
                result=false;
                break;
            }
        }
        return result;
    };

    /**
     * 判断json是否在json数组中存在
     * @param jsonObj
     * @param jsonArray
     * @param rule
     * @returns {number}
     */
    var indexOfJsonArray = function(jsonObj,jsonArray,rule){
        var index = -1;
        rule = rule||jsonEqual;
        for(var i= 0,item;item=jsonArray[i++];){
            if(rule(jsonObj,item)){
                index = i-1;
                break;
            }
        }
        return index;
    };

    /**
     * 求json数组A到B的差集
     * @param jsonArrayA
     * @param jsonArrayB
     * @param rule
     */
    var jsonArrayIntersection = function(jsonArrayA,jsonArrayB,rule){
        var result = [];
        rule = rule||jsonEqual;
        for(var i= 0,a;a=jsonArrayA[i++];){
            if(indexOfJsonArray(a,jsonArrayB,rule)==-1){
                result.push(a);
            }
        }
        return result;
    };

    /**
     * 序列化表单元素为JSON对象
     * @param form          Form表单id或表单jquery DOM对象
     * @returns {{}}
     */
    var serialize = function(form){
        var $form = (typeof(form)=="string" ? $("#"+form) : form);
        var dataArray =  $form.serializeArray(),result={};
        $(dataArray).each(function(){
            if(result[this.name]){
                result[this.name].push(this.value);
            }else{
                var element = $form.find("[name='"+ this.name +"']")[0];
                var type = ( element.type || element.nodeName ).toLowerCase();
                result[this.name] = (/^(select-multiple|checkbox)$/i).test(type) ? [this.value] : this.value;
            }
        });
        return result;
    };

    /**
     * 设置表单值
     * @param form          Form表单id或表单jquery DOM对象
     * @param data          json对象，多选时为数组
     * 代码实现参考此开源项目https://github.com/kflorence/jquery-deserialize/
     */
    var deserialize = function(form,data){
        var rcheck = /^(?:radio|checkbox)$/i,
            rselect = /^(?:option|select-one|select-multiple)$/i,
            rvalue = /^(?:button|color|date|datetime|datetime-local|email|hidden|month|number|password|range|reset|search|submit|tel|text|textarea|time|url|week)$/i;

        var $form = (typeof(form)=="string" ? $("#"+form) : form);

        //得到所有表单元素
        function getElements( elements ) {
            return elements.map(function() {
                return this.elements ? jQuery.makeArray( this.elements ) : this;
            }).filter( ":input:not(:disabled)" ).get();
        }
        //把表单元素转为json对象
        function elementsToJson( elements ) {
            var current,elementsByName = {};
            jQuery.each( elements, function( i, element ) {
                current = elementsByName[ element.name ];
                elementsByName[ element.name ] = current === undefined ? element :
                    ( jQuery.isArray( current ) ? current.concat( element ) : [ current, element ] );
            });
            return elementsByName;
        }

        var elementsJson = elementsToJson(getElements($form));

        for(var key in data){
            var val = data[key];
            var dataArr = [];
            if( $.isArray(val)){
                for(var i= 0,v;v=val[i++];){
                    dataArr.push({name:key,value:v});
                }
            } else{
                dataArr.push({name:key,value:val});
            }

            for(var m= 0,vObj;vObj=dataArr[m++];){
                var element;
                //如果表单中无元素则跳过
                if ( !( element = elementsJson[vObj.name] ) ) {
                    continue;
                }
                var type = element.length?element[0]:element;
                type = ( type.type || type.nodeName ).toLowerCase();

                var property = null;
                if ( rvalue.test( type ) ) {
                    element.value = vObj.value
                } else if ( rcheck.test( type ) ) {
                    property = "checked";

                } else if ( rselect.test( type ) ) {
                    property = "selected";
                }
                //设置选中
                if(property) {
                    for(var n= 0,e;e=element[n++];){
                        if(e.value==vObj.value){
                            e[property] = true;
                        }
                    }
                }
            }
        }
    };

    return {
        indexOfJsonArray:indexOfJsonArray,
        jsonArrayIntersection:jsonArrayIntersection,
        serialize:serialize,
        deserialize:deserialize
    }
});