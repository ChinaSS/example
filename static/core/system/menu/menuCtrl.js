define(["jquery"],function($){

    return function($compile,$scope){
        require(["PDMenuDir/menuSupport"],function(menuSupport){
            menuSupport.init();
        });
    };
});