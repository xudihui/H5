//引导页面


window.showGuide = function(arr) {
	var l = arr.length;
	var img = '';
	for(var i=0; i<l; i++){
		img += '<img class="heloo_guide" element="' + arr[i].element + '" style="display:none;height:53px;z-index:1002;position:absolute;' + arr[i].position + '" src="' + arr[i].src + '"/>'	
	}
	var height = Math.max($('body').height(),$(window).height());
	img = '<div id="guide_frame" style="width:100%;background:rgba(0,0,0,.5);position:absolute;z-index:999;top:0;left:0;height:' + height + 'px"></div>' + img;
	$('body').append($(img));
	$('body').bind('click',function(){
		var that = $('img.heloo_guide:visible');
		that.css('display','none');
		$(that.attr('element')).css('z-index','');
		if(that.next().length > 0){
			 that.next().css('display','block');
			 if(that.next().attr('element')!=undefined){
				$(that.next().attr('element')).css('z-index','1001');
			 }
		}
		else{
		     $('img.heloo_guide,#guide_frame').remove();//把原先的fade消失，改成直接移除dom元素	
		}			
	});
    $('.heloo_guide').first().css('display','block');
	$( $('.heloo_guide').first().attr('element')).css('z-index','1001');
};