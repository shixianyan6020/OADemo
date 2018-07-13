
mui.init({
	swipeBack:false
});
		
		
//将ios中独有的东西在android上屏蔽		
var isLoadMarquee = false;
var isLoadRecommend = false;
var isLoadFloor = false;
var currentWebview;
var marqueeArray = []; //跑马灯数据数组
var recommendArray = null; //推荐商品数组
var floorArray = null; //楼层商品数组

//轮播图列表
var curBannerList= null;

//商品分类列表
var curGoodTypeList=null;


mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	
//	console.log("show home begin");

	//设置跑马灯
//	setMarquee();
	//设置推荐商品
	showRecommendGood();
	
	setFloor();
	//进到这个函数说明plusready可以通信(解决为什么第一个显示的界面不没有触发show函数)
	pasueLink();
	//监听show事件请求数据
	currentWebview.addEventListener('show', function() {
//		console.log("show home");
		pasueLink();
		
		showRecommendGood();
	
		setFloor();		
	});

	//注册商品分类点击事件
	addGoodClassEvent();

	//添加点击商品明细
	mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
		openProDetail(this.id);
	});


//	console.log("show home end");
	
});


function openProDetail(product_id)
{
	if(product_id==null || product_id==undefined)
	{
		return ;
	}
	window.pushDetailView({
		"product_id": product_id
	});

}




function addGoodClassEvent()
{
	
	mui('#goodClass').off('tap', 'a');
	
	//添加处理每一个商品分类点击事件
	mui('#goodClass').on('tap', 'a', function() {
		
		var itemID = this.id;
		var title = this.name;
		window.pushProListView({title: title,categoryID: itemID,"categoryLevel":1});
	});		
}


function addBannerEvent()
{
	
	mui('#productSlider').off('tap', 'a');
	
	//添加处理每一个商品分类点击事件
	mui('#productSlider').on('tap', 'a', function() {
		
		var banner = getBannerById(this.id);
		
//		console.log(JSON.stringify(banner));
	});		
}

//与服务器通信
function pasueLink() {
//	if(!isLoadMarquee && marqueeArray.length <= 0) {
//		//开始请求
//		isLoadMarquee = true;
//	}
	
	if(curBannerList==null || curBannerList.length <= 0) {
		//开始请求
		ajax_get_home_data({},getHomeDataSuccess);
	}	
	
	
	if(recommendArray==null || recommendArray.length <= 0) {
		ajax_get_Recommend();
	}
	
	if(floorArray==null || floorArray.length <= 0) {
		isLoadFloor = true;
//		console.log("ddd");
		ajax_get_Floor(getFloorSuccess);
	}	

}

function getHomeDataSuccess(res)
{
//	console.log("home:"+JSON.stringify(res));
	if(res.status=="success")
	{
		var homeData = res.data;
		curBannerList = homeData.bannerList;
		curGoodTypeList = homeData.goodTypeList;
		
		//显示轮播图和商品分类
		showBannerList(curBannerList);
		showGoodTypeList(curGoodTypeList);
	}
	else
	{
		mui.toast("加载数据失败!");
	}
	
}


function getMarqueeSuccess(data) {


	isLoadMarquee = false;
}

function getFloorSuccess(res) {

	if(res.status=="success")
	{
		floorArray = res.data;
		setFloor();
	}

}

function getRecommendSuccess(data) {
	
	recommendArray = data.list;
	showRecommendGood();
//	var recommend = document.getElementById('recommend');	
//	window.showGoodList(data.list,recommend);


	isLoadRecommend = false;
}

/**
 * 根据图片id获取banner对象
 */
function getBannerById(bannerANodeId)
{
	if(curBannerList==null)
	{
		return null;
	}
	
	for ( var n=0; n<curBannerList.length;n++)
	{
		var banner = curBannerList[n];
		if(banner==null)
		{
			return null;
		}
		if(banner.bannerId==bannerANodeId)
		{
			return banner;
		}
	}

	return null;
}



function showBannerList(bannerList)
{
	if(bannerList==null)
	{
		return ;
	}
	
	
	var bannerSliderNode = document.getElementById('productSlider');
	
	G_removeAllChildNode(bannerSliderNode);

	var sliderGroup = HCoder.createDivNode({"class":"mui-slider-group mui-slider-loop"});
	bannerSliderNode.appendChild(sliderGroup);
	var sliderIndicator = HCoder.createDivNode({"class":"mui-slider-indicator"});
	bannerSliderNode.appendChild(sliderIndicator);	
	
	for ( n=0; n<bannerList.length;n++) {
		
		var banner = bannerList[n];
		banner["bannerId"]= "banner_"+banner.id;
		
		if(n==0)
		{
			var bannerLast = bannerList[bannerList.length-1];
			var sliderItemDuplicate = HCoder.createDivNode({"class":"mui-slider-item mui-slider-item-duplicate"});
			var aNode = HCoder.createANode({});
			var imgNode = HCoder.createImgNode({"src":bannerLast.imgUrl});
			aNode.appendChild(imgNode);
			sliderItemDuplicate.appendChild(aNode);
			sliderGroup.appendChild(sliderItemDuplicate);			
			
		}
		
			var sliderItem = HCoder.createDivNode({"class":"mui-slider-item"});
			var aNode = HCoder.createANode({"id":banner.bannerId});
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
	slider.slider();	
	
	addBannerEvent();
}

/**
 *  显示商品分类
 * @param {Object} goodTypeList
 */
function showGoodTypeList(goodTypeList)
{
	var typeParentNode= document.getElementById('goodClass');
	if(typeParentNode==null)
	{
		return ;
	}
	G_removeAllChildNode(typeParentNode);
	
	for (var i=0;i<goodTypeList.length;i++) {
		
		goodType = goodTypeList[i];
		
		showOneGoodType(goodType,typeParentNode);
		
	}
	
	
	addGoodClassEvent();
	
}

function showOneGoodType(goodType,parentNode)
{
	var aNode = HCoder.createANode({"id":goodType.gc_id,"name":goodType.gc_name,"class":"weui-grid js_grid"});
	
	var divNode = HCoder.createDivNode({"class":"weui-grid__icon"});
	var imgNode = HCoder.createImgNode({"src":goodType.imgUrl});
	divNode.appendChild(imgNode);
	var pNode = HCoder.createPNode({"class":"weui-grid__label"});
	pNode.innerHTML=goodType.gc_name;
	
	aNode.appendChild(divNode);
	aNode.appendChild(pNode);
	
	parentNode.appendChild(aNode);
}


function setMarquee() {
	var sliderMarquee = document.getElementById('productSlider');
	var sliderGroup = document.createElement('div');
	sliderGroup.className = 'mui-slider-group mui-slider-loop';
	sliderMarquee.appendChild(sliderGroup);
	var sliderIndicator = document.createElement('div');
	sliderIndicator.className = 'mui-slider-indicator';
	sliderMarquee.appendChild(sliderIndicator);

	for(var i = 0; i < marqueeArray.length; i++) {

		if(0 == i) {
			var sliderItemDuplicate = document.createElement('div');
			sliderItemDuplicate.className = 'mui-slider-item mui-slider-item-duplicate';
			sliderItemDuplicate.innerHTML = '<a href="#">\
							<img src="' + marqueeArray[marqueeArray.length - 1].imagerpath + '" />\
						</a>';
			sliderGroup.appendChild(sliderItemDuplicate);
		}

		var sliderItem = document.createElement('div');
		sliderItem.className = 'mui-slider-item';
		sliderItem.innerHTML = '<a href="#">\
						<img src="' + marqueeArray[i].imagerpath + '" />\
					</a>';
		sliderGroup.appendChild(sliderItem);

		var indicatorItme = document.createElement('div');
		if(i == 0) {
			indicatorItme.className = 'mui-indicator mui-active';
		} else {
			indicatorItme.className = 'mui-indicator';
		}
		sliderIndicator.appendChild(indicatorItme);

		if(marqueeArray.length - 1 == i) {
			var sliderItemDuplicate = document.createElement('div');
			sliderItemDuplicate.className = 'mui-slider-item mui-slider-item-duplicate';
			sliderItemDuplicate.innerHTML = '<a href="#">\
							<img src="' + marqueeArray[0].imagerpath + '" />\
						</a>';
			sliderGroup.appendChild(sliderItemDuplicate);
		}

		var slider = mui('.mui-slider');
		slider.slider();
	}
}
		
//显示推荐商品
function showRecommendGood()
{
	if(recommendArray==null)
	{
		return ;
	}
	
	
	var recommendNode = document.getElementById('recommend');	
	G_removeAllChildNode(recommendNode);
	var pName= HCoder.createH5Node({"class":"floor-name","innerHTML":"特别推荐"});
	
	recommendNode.appendChild(pName);
	
	window.showGoodList(recommendArray,recommendNode);	
	
}

//设置楼层
function setFloor() {
	
	if(floorArray==null)
	{
		return ;
	}
	
	
	var floorsNode = document.getElementById('floors');
	G_removeAllChildNode(floorsNode);
	
	for (var m=0;m<floorArray.length;m++) {
		
		floor = floorArray[m];
		var floorDiv = HCoder.createDivNode({"class":"floor-Div","innerHTML":floor.className});
		var floorPName= HCoder.createPNode({"class":"floor-name","innerHTML":floor.className});
		floorsNode.appendChild(floorPName);
		window.showGoodList(floor.goods,floorDiv);
		
		floorsNode.appendChild(floorDiv);
	}
	
}


function initSomeData() {
//	for(var i = 0; i < 8; i++) {
//		
//		var floor = {"name":"洗护"+i,"id":i};
//		
//		floor["items"] = [];
//		
//		for (var j=0;j<6;j++) 
//		{
//			var dataItem = {};
//			dataItem.product_price = {
//			default_price: "20.00",
//			list_price: "28.0"
//			};
//			dataItem.product_name = "化妆品"+i+"_"+j;
//			dataItem.imgUrl = "../img/bg.jpeg";
//			dataItem.product_id = i+"_"+j;
//			floor["items"].push(dataItem);
//			
//		}
//
//		floorArray.push(floor);
//	}
	
	
	for(var i = 0; i < 5; i++) {
		var marqueeItem = {};
		marqueeItem.contentId = i;
		marqueeItem.imagerpath = '../img/slider/slider' + (i + 1) + '.jpg';

		marqueeArray.push(marqueeItem);
	}
}

