define(["jquery"],function($){

    return function($compile,$scope){
        require(["PDDictDir/dict"],function(Dict){
        	Dict.initDictManager();
        });
    };
});