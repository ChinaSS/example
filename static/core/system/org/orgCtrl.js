define(["jquery"],function($){

    return function($compile,$scope){
        require(["OrgDir/orgSupport"],function(orgSupport){
            orgSupport.orgMainInit();
        });
    };
});