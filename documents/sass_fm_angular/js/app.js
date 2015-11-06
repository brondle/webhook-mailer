'use strict';


angular.module('myApp', [])
	.controller('SearchController', function($scope, $http){

	if($scope.search === undefined) {
		$scope.search = "";
		fetch();
	}

	var pendingTask;

	$scope.change = function(){
		if(pendingTask){
			clearTimeout(pendingTask);
		}
		pendingTask = setTimeout(fetch, 800);
	}

	function fetch() {
		$http.get("https://api.discogs.com/database/search?q=" + $scope.search + "&key=sgPQPSrsXwtszVQohmLS&secret=AkCvXlTSVACjBxuLHSKQteoeuFQFvZVY").success(function(response){$scope.details = response; console.log(response)});
		/* do something for related results, eventually use Grunt to store secret & key */
	}

	$scope.update = function(result) {
		$scope.search = result.Title;
		$scope.change();
	};

	$scope.select = function() {
		this.setSelectionRange(0, this.value.length);
	}
});
