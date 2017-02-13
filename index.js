angular.module('app',['ngStorage'])
.controller('appController', ['$scope', 'productDescription', '$localStorage', function($scope, productDescription, $localStorage){
	$scope.cart = {};
	$scope.cartPrice = 0;
	$scope.cartSize = 0;
	function initController(){
		productDescription({}, function(response){
			if(response.data && response.status === 200){
				$scope.products = response.data.data;
				console.log(response);
				if($localStorage.cart && Object.keys($localStorage.cart).length){
					$scope.cartPrice = $localStorage.cartPrice;
					for(key in $localStorage.cart){
						var index = parseInt(key);
						$scope.products[index].Quantity = $localStorage.cart[key].Quantity;
						$scope.products[index].index = index;
						$scope.cart[key] = $scope.products[index];
					}
					$scope.cartSize = Object.keys($scope.cart).length;
				}
			}
		})
	}
	function initFunctions(){
		$scope.changeQuantity = function(index,change){
			var product = $scope.products[index];
			if(product.Quantity){
				if(change){
					product.Quantity += change;
					$scope.cartPrice += product.Price;
					$localStorage.cart[index].Quantity += 1;
				}
				else{
					$scope.cartPrice -= product.Price;
					product.Quantity -= 1;
					$localStorage.cart[index].Quantity -= 1;
					if(!product.Quantity){
						$scope.cart[index].Quantity = 0;
						$localStorage.cart[index].Quantity = 0;
						delete $scope.cart[index];
						delete $localStorage.cart[index];
						$scope.cartSize -= 1;
					}
				}
			}
			else{
				if(!$localStorage.cart){
					$localStorage.cart = {};
				}
				$localStorage.cart[index] = {};
				product.Quantity = 1;
				product.index = index;
				$scope.cart[index] = product;
				$localStorage.cart[index].Quantity = product.Quantity;
				$scope.cartPrice += product.Price;
				$scope.cartSize += 1;
			}
			$localStorage.cartPrice = $scope.cartPrice;
		}
		$scope.removeItem = function(index){
			$scope.cartPrice -= $scope.cart[index].Quantity*$scope.cart[index].Price;
			$scope.cartSize -= 1;
			$scope.cart[index].Quantity = 0;
			$localStorage.cart[index].Quantity = 0;
			delete $scope.cart[index];
			delete $localStorage.cart[index];
			$localStorage.cartPrice = $scope.cartPrice;

		}
	}
	initController();
	initFunctions();
}])
.factory('productDescription',['$http', function($http){
	return function(requestObj, callBack){
		var url = 'products.json'
		$http.get(url, requestObj)
		.then(function(response){
			callBack(response);
		},
		function(error){
			console.log("Error in getting products");
		});


	}
}])