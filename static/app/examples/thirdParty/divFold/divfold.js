define(["jquery"],function($) {
	var divfold=function divFold($linksDiv, $targetContainer, $pops) {
		if ($linksDiv && $targetContainer&&$pops) {
			var $links = $linksDiv.find("a"); 
			var $targets = $targetContainer; 
			var $aTargets = $pops; 
			var current = 0;

			$aTargets.each(function() {
				$(this).remove();
			});
			$targets.css("display", "block");

			$links.each(function(i) {
				$(this).click(function(event) {
					event.preventDefault();
					$($aTargets[current]).remove();
					current = i;
					$targets.append($aTargets[current]);
				});
			});

			$targets.append($aTargets[current]);
		}
	}  //   function over
	return {
		divFold : divfold
	}
});
//@ sourceURL=divfold.js