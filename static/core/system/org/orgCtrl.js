define(["jquery"],function($){

    return function($compile,$scope){
        require(["PDOrgDir/orgSupport"],function(orgSupport){
            orgSupport.orgMainInit();
        });
    };
});