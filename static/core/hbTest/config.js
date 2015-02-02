require.config({
   //baseUrl:"/example/static",
    paths:{
        //基础模块配置
       "hbTestDir":"/example/static/core/hbTest"
    },
    map:{
        '*':{
            'css': 'modules/requirejs/plugin/css.min',
            'text':'modules/requirejs/plugin/text'
        }
    }
});