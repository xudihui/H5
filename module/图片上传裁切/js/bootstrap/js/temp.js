  angular.module('app', ['ngSanitize']);  
  function shoppingDetail($scope, $sce) {
	  $scope.items = [   //dataModel
		{"balance": "115",
		 "time": "2015/01/10 02:16",
		 "name": "市民卡网站",
		 "type": "消费",
		 "money": "-22",	
		 "state": "已完成",	
		 "age":0
		 },
		{"balance": "623",
		 "time": "2015/01/12 19:33",
		 "name": "市民卡网站",
		 "type": "消费",
		 "money": "-22",	
		 "state": "已完成",	
		 "age":0
		 },
		{"balance": "764",
		 "time": "2015/01/13 17:11",
		 "name": "市民卡网站",
		 "type": "账户充值",
		 "money": "22",	
		 "state": "待付款",	
		 "age":0
		 },
		{"balance": "845",
		 "time": "2015/01/11 22:26",
		 "name": "市民卡网站",
		 "type": "消费",
		 "money": "-22",	
		 "state": "已完成",	
		 "age":0
		 },		 
		];
		$scope.modifyStyle = function(x) {
		  if(!isNaN(x)){
			  return '<span class="' + (x>0 ? 'blue' : 'dark')   +'">'+ '￥' + x + '</span>';		  
		  }
		  else{
		      return '<span class="' + (x=='待付款' ? 'blue' : 'gray')   +'">' + x + '</span>';
		  }
		}
		/*
		$scope.shoppingDetail_html = function() {
           return $sce.trustAsHtml($scope.shoppingDetail);
		};
		*/
		$scope.orderProp = '-time'; //默认按照时间正序排练
		$scope.orderAdd = function(){
		    $scope.orderProp = 'time' 
		}
		$scope.orderReduce = function(){
		    $scope.orderProp = '-time' 
		}		
		
		
		
    }
	$('.switch input').bind('click',function(){
		var that = $(this);
		setTimeout(function(){that.parent().css('background',that.prop('checked') ? '#4cd764' : '#fff')},250)
	})
 
  jQuery.prototype.progress=function(){var i=jQuery.queue(this[0]);return!i||i&&0==i.length?!1:!0}
  
  $('ul.list-unstyled li').bind('click',function(){
     var html = $(this).children('a').html();
     $(this).parents('.item-public').find('a span').html('时间筛选:'+html);
	 $(this).parent().slideUp(200);
  })
  
  $('.item-public a.item-public-title').bind('click',function(){
     var that = $(this);
     var parent = $(this).parent();
	 var ul = parent.children('ul');
	 ul.css('display') == 'none' ? ( !ul.progress() ? ul.slideDown(500,function(){that.addClass('show')}) : '' ) : ul.slideUp(50,function(){that.removeClass('show')});
  });

