define(["jquery"],function($){

    return function($compile,$scope){
        require(["AclDir/aclSupport"],function(aclSupport){
            aclSupport.init();
        });
    };
});