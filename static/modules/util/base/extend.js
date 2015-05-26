//类继承函数组
/*
 * Function原型添加mix函数,从元类扩展API
 * 
 */
 Function.prototype.mix = function(obj){
    //是否仅扩展指定api
    if (arguments.length>1) {
        var apis = arguments.slice(1),
            reqApi = {};
        for (var i = 0; i < apis.length; i++) {
            reqApi[apis[i]]=apis[i];
        }
    }
    //遍历元类
    for(var fn in obj.prototype){
        if (obj.prototype.hasOwnProperty(fn)) {
            //如果非指定api或者元类api与本类函数名冲突,则跳过该api
            if ((!!reqApi&&!reqApi[fn])||!!this.prototype[fn]){continue;}
            this.prototype[fn]=obj.prototype[fn];
        }
    }
 };

 /*
 * Function原型添加extend函数,用于继承,
 */
 Function.prototype.extend = function(superClass){
    var subClass = this;
    var Fn = function(){};
    Fn.prototype = superClass.prototype;
    subClass.prototype = new Fn();
    subClass.prototype.constructor = subClass;

    subClass.superClass = superClass.prototype;
    if (superClass.prototype.constructor==Object.prototype.constructor) {
        superClass.prototype.constructor=superClass;
    }
 };