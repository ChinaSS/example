/**
 * 校验中文长度
 */
jQuery.validator.addMethod("chineseLength", function(value, element, param) {
    var tempValue = value;
    tempValue = tempValue.replace(/[^\x00-\xff]/g, 'xx');
    tempValue = tempValue.replace(/[\r\n]/g, 'xx');
    var length = tempValue.length;
    return this.optional(element) || length <= param;
});
// 字母数字
jQuery.validator.addMethod("alnum", function(value, element) {
	return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
}, "只能包括英文字母和数字");
//  正则表达式校验
jQuery.validator.addMethod("regex", function(value, element, params) {  
    var exp = new RegExp(params);  
    return exp.test(value);  
}, "正则校验格式错误"); 
// 邮政编码验证
jQuery.validator.addMethod("zipcode", function(value, element) {
	var tel = /^[0-9]{6}$/;
	return this.optional(element) || (tel.test(value));
}, "请正确填写邮政编码");
// 汉字  
jQuery.validator.addMethod("chcharacter", function(value, element) {
	var tel = /^[\u4e00-\u9fa5]+$/;
	return this.optional(element) || (tel.test(value));
}, "请输入汉字");
// 字符最小长度验证（一个中文字符长度为2）
jQuery.validator.addMethod("stringMinLength", function(value, element, param) {
	var length = value.length;
	for ( var i = 0; i < value.length; i++) {
		if (value.charCodeAt(i) > 127) {
			length++;
		}
	}
	return this.optional(element) || (length >= param);
}, jQuery.validator.format("长度不能小于{0}!"));

// 字符最大长度验证（一个中文字符长度为2）
jQuery.validator.addMethod("stringMaxLength", function(value, element, param) {
	var length = value.length;
	for ( var i = 0; i < value.length; i++) {
		if (value.charCodeAt(i) > 127) {
			length++;
		}
	}
	return this.optional(element) || (length <= param);
}, jQuery.validator.format("长度不能大于{0}!"));
// 字符验证
jQuery.validator.addMethod("string", function(value, element) {
	return this.optional(element) || /^[\Α-\￥\w]+$/.test(value);
}, "不允许包含特殊符号!");
// 手机号码验证
jQuery.validator.addMethod("mobile", function(value, element) {
	var length = value.length;
	return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/.test(value));
}, "手机号码格式错误!");
// 电话号码验证
jQuery.validator.addMethod("phone", function(value, element) {
	var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
	return this.optional(element) || (tel.test(value));
}, "电话号码格式错误!");
// 传真号码验证
jQuery.validator.addMethod("fax", function(value, element) {
	var tel = /^(\d{2,4}-?)?(\d{3,4}-?)?\d{7,9}$/g;
	return this.optional(element) || (tel.test(value));
}, "传真号码格式错误[格式如86-010-111122222,86-010-1111122222]!");
// 邮政编码验证
jQuery.validator.addMethod("zipCode", function(value, element) {
	var tel = /^[0-9]{6}$/;
	return this.optional(element) || (tel.test(value));
}, "邮政编码格式错误!");
// 必须以特定字符串开头验证
jQuery.validator.addMethod("begin", function(value, element, param) {
	var begin = new RegExp("^" + param);
	return this.optional(element) || (begin.test(value));
}, jQuery.validator.format("必须以 {0} 开头!"));
// 验证两次输入值是否不相同
jQuery.validator.addMethod("notEqualTo", function(value, element, param) {
	return value != $(param).val();
}, jQuery.validator.format("两次输入不能相同!"));
// 验证值不允许与特定值等于
jQuery.validator.addMethod("notEqual", function(value, element, param) {
	return value != param;
}, jQuery.validator.format("输入值不允许为{0}!"));
// 验证值必须大于特定值(不能等于)
jQuery.validator.addMethod("gt", function(value, element, param) {
	return value > param;
}, jQuery.validator.format("输入值必须大于{0}!"));

//小数验证
jQuery.validator.addMethod("validateNumber", function(value, element, param){
    var decimal = '^\\d{1,' + param[0] + '}(\\.\\d{1,' + param[1] + '})?$';
    var reg = new RegExp(decimal);
    return this.optional(element) || reg.exec(value) != null;
}, "请输入整数位最长为{0} ,小数位最长为{1}的数字");
//时间比较:当前日期必须大于前一个日期
jQuery.validator.addMethod("compareDate",function(value, element, param){
        var assigntime = jQuery(param).val();
        var deadlinetime = value;
        if(isnull(assigntime)&&isnull(deadlinetime))return true;
        var reg = new RegExp('-','g');
        assigntime = assigntime.replace(reg,'/');//正则替换
        deadlinetime = deadlinetime.replace(reg,'/');
        assigntime = new Date(parseInt(Date.parse(assigntime),10));
        deadlinetime = new Date(parseInt(Date.parse(deadlinetime),10));
        return assigntime <= deadlinetime;
},"当前日期必须大于前一个日期");

//验证手动填写时间框是否符合时间格式
jQuery.validator.addMethod("ymdDate",function(value, element, param){
	var y = jQuery(param[0]).val();
	var m = jQuery(param[1]).val();
	var dateStr;
	if (y && m && value) {
		dateStr = y + "-" + m + "-" + value;
		if (!Date.parse(dateStr)) {
			return false;
		}
	} else if (y && m) {
		dateStr = y + "-" + m
		if (!Date.parse(dateStr)) {
			return false;
		}
	}
	return true;
},"请填写正确时间");

