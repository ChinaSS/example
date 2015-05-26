require(["Ace", "PDCoreDir/home/homeApp", "PDAppDir/appPath", "PDCoreDir/corePath", "PDGlobalDir/base"], function (Ace, HomeApp) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['HomeApp']);
        Ace.init();
    });
});