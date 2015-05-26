define(["jquery"],function($){

    return function($compile,$scope){
        require(["PDAclDir/aclSupport"],function(aclSupport){
            aclSupport.init();
        });
    };
});