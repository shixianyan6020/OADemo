/**
 * 封装轮播图渲染组件
 */
var commonSlider = function()
{
	/**
	 * 轮播图列表
	 */
	var _curBannerList= null;
	
	/**
	 * 轮播图容器对象
	 */
	var _parentNodeId = null;
	
	var init = function(options)
	{
		if(options==null)
		{
			return ;
		}
		
		if(options.bannerList==undefined)
		{
			return ;
		}
		if(options.parentId==undefined)
		{
			return ;
		}
		
		_parentNodeId = document.getElementById(options.parentId);
		
		_curBannerList = options.bannerList;
		
		//渲染
		renderSlider(_parentNodeId,_curBannerList);
		
		
	}
	
	/**
	 * 渲染轮播图
	 * @param {Object} parentNode
	 * @param {Object} bannerList
	 */
	var renderSlider = function(parentNode,bannerList)
	{
		if(bannerList==null)
		{
			return ;
		}
		
		if(bannerList.length==0)
		{
			return ;
		}
		

		G_removeAllChildNode(parentNode);
	
		var sliderGroup = HCoder.createDivNode({"class":"mui-slider-group mui-slider-loop"});
		parentNode.appendChild(sliderGroup);
		var sliderIndicator = HCoder.createDivNode({"class":"mui-slider-indicator"});
		parentNode.appendChild(sliderIndicator);	
		
		for (var n=0; n<bannerList.length;n++) {
			
			var banner = bannerList[n];
			banner["bannerId"]= "banner_"+banner.id;
//			bannerList.length-1
			if(n==0)
			{
				var bannerLast = bannerList[0];
				var sliderItemDuplicate = HCoder.createDivNode({"class":"mui-slider-item mui-slider-item-duplicate"});
				var aNode = HCoder.createANode({"href":"#"});
				var imgNode = HCoder.createImgNode({"src":bannerLast.imgUrl});
				aNode.appendChild(imgNode);
				sliderItemDuplicate.appendChild(aNode);
				sliderGroup.appendChild(sliderItemDuplicate);			
				
			}
			
				var sliderItem = HCoder.createDivNode({"class":"mui-slider-item"});
				var aNode = HCoder.createANode({"id":banner.bannerId,"href":"#"});
				var imgNode = HCoder.createImgNode({"src":banner.imgUrl});
				aNode.appendChild(imgNode);
				sliderItem.appendChild(aNode);
				sliderGroup.appendChild(sliderItem);			
			
			var indicatorItme = HCoder.createDivNode({});
			if(n == 0) {
				indicatorItme.className = 'mui-indicator mui-active';
			} else {
				indicatorItme.className = 'mui-indicator';
			}
			
			sliderIndicator.appendChild(indicatorItme);		
			
			
			if(n==(bannerList.length-1))
			{
				var bannerFirst = bannerList[0];
				var sliderItemDuplicate = HCoder.createDivNode({"class":"mui-slider-item mui-slider-item-duplicate"});
				var aNode = HCoder.createANode({"href":"#"});
				var imgNode = HCoder.createImgNode({"src":bannerFirst.imgUrl});
				aNode.appendChild(imgNode);
				sliderItemDuplicate.appendChild(aNode);
				sliderGroup.appendChild(sliderItemDuplicate);			
				
			}		
		}	
			
		var slider = mui('.mui-slider');
		slider.slider({
		interval: 0 //自动轮播周期，若为0则不自动播放，默认为0；
	});		
		
		
		
	}
	
	/**
	 * 注册轮播图点击事件
	 */
	var regEvent= function()
	{
		
		
	}
	

	return {
		init:init
	};
	
}











