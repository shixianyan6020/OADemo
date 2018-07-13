mui.init({
	swipeBack: true
});

var curShowItem; //当前滚动条
var curOrderStatus="";

//分页查询参数
var queryParam={};

//当前加载的数据
var curLoadGood=null;

var tabItemList=new Array();
var curTabItem=null;

(function($) {
 
	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: true,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});

})(mui);


//底部tab窗体对象列表
var barItemUrl = [];
	barItemUrl.push({"index":0,"show":false,"title":"宝贝分类","url":"store-good-class.html"});
	barItemUrl.push({"index":1,"show":false,"title":"店铺简介","url":"store-about.html"});
//	barItemUrl.push({"index":2,"title":"联系卖家","url":"baritemHtml/cart.html"});

//当前店铺对象
var curStore=null;

var curStoreView = null;

// 轮播图
var store_slider= null;

mui.plusReady(function()
{
	store_slider = new commonSlider();
	curStoreView = plus.webview.currentWebview();
	window.addEventListener("init",function(options){
		
//		console.log(JSON.stringify(options.detail));
		
		loadStoreInfo(options.detail);
		loadStoreHome(options.detail);
	});
	
//	inittabitemWebviews(curStoreView);
	
	//下边tab框
	mui('.mui-bar-tab').on('tap', '.mui-tab-item',function(){
		
		tabOption = {"tabId":this.id,"index":this.getAttribute('href')};
		onTabChange(tabOption);
	});
	
	//上边的tab框切换
	mui('.mui-segmented-control').on('tap', 'a',function(){
		
		tabId = this.getAttribute('href');
		tabId = tabId.substring(1,tabId.length);
//		console.log("dd"+this.getAttribute('href'));

		onChangeGoodTab(tabId);
	});	
	
	//添加每个item点击的监听事件#productsList
	mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
		
//		console.log(this.id);
		if(this.id !=undefined)
		{
			window.pushDetailView({"product_id": this.id});
		}
	});
	
});


/**
 * 加载店铺基本基本信息
 * @param {Object} param
 */
function loadStoreInfo(param)
{
	var options = {"storeId":param.storeId};
	
	ajax_post_load_storeInfo(options,loadStoreInfoSuccess);
}

function loadStoreInfoSuccess(res)
{
	if(res.status == "success")
	{
		curStore = res.data;
		showStoreName(curStore);
		initGoodTabItem();
	}
	else
	{
		mui.alert(res.description);
	}
	
	
}

/**
 * 显示店铺名称基本信息
 * @param {Object} store
 */
function showStoreName(store)
{
	var storeNameDiv = document.getElementById('store_name');
	if(storeNameDiv==null)
	{
		return ;
	}
	
	G_removeAllChildNode(storeNameDiv);
	if(store.logoUrl ==null)
	{
		store.logoUrl = "../img/50.jpg";
	}
	
	var imgLogo = HCoder.createImgNode({"src":store.logoUrl,"class":"mui-media-object mui-pull-left store-logo-img"});
	storeNameDiv.appendChild(imgLogo);
	
	//店铺logo
	var nameDiv = HCoder.createDivNode({"class":"mui-pull-left","innerHTML":store.store_name});
	var pName = HCoder.createPNode({"class":"mui-ellipsis","innerHTML":store.store_ower});
	
	nameDiv.appendChild(pName);
	storeNameDiv.appendChild(nameDiv);

}


/**
 * 下边的tab框切换
 * @param {Object} tabOption
 */
function onTabChange(tabOption)
{
//	console.log(JSON.stringify(tabOption));
	changeTab(tabOption.index);
//	mui('#scroll1').scroll(0,100);
}


/**
 * 切换tab窗口
 * @param {Object} index
 */
function changeTab(index)
{
	if(index==null || index==undefined)
	{
		return ;
	}
	
	if(index<0 ||index>=barItemUrl.length)
	{
		return ;
	}

	barItem = barItemUrl[index];
	openNewWindow({"url":barItem.url,"id":barItem.url,"extras":{"store":curStore}});
	
	
//	showCurWebView(index);
	
}

//设置webview的切换显示的函数
//function showCurWebView(index) {
//	for(var i = 0; i < barItemUrl.length; i++) {
//		barItem = barItemUrl[i];
//		
//		if(i == index) {
//			barItem.webView.show();
//			barItem.show=true;
//		} else {
//			barItem.show=false;
//			barItem.webView.hide();
//		}
//	}
//}

//mui.back = function() {
//	
////	console.log("mui back");
//	for(var i = 0; i < barItemUrl.length; i++) {
//		barItem = barItemUrl[i];
//		if(barItem.show==true)
//		{
//			barItem.webView.hide();
//			barItem.show=false;
//			return ;
//		}
//	}	
//	
//	hideStoreView();
////	mui.back();
//	
//}

/**
 * 加载店铺首页数据 楼层和轮播图
 */
function loadStoreHome(param)
{
	var options = {"storeId":param.storeId};
	
	ajax_post_load_storeHome(options,loadStoreHomeSuccess);	
	
}

function loadStoreHomeSuccess(res)
{
	if(res.status =="success")
	{
		renderStoreHome(res.data);
		
	}
	else
	{
		mui.alert(res.description);
	}
	
	
//	store_slider
}

/**
 * 渲染店铺首页内容
 * @param {Object} homeData
 */
function renderStoreHome(homeData)
{
	//渲染轮播图
//	homeData.slideImg.push(homeData.slideImg[0]);
	store_slider.init({"parentId":"slider","bannerList":homeData.slideImg});
	
	//渲染楼层
	var floorsNode = document.getElementById('floors');
	G_removeAllChildNode(floorsNode);
	var floorArray = homeData.floors;
	for (var m=0;m<floorArray.length;m++) {
		
		floor = floorArray[m];
		if(floor.goods.length==0)
		{
			continue;
		}
		
		var floorDiv = HCoder.createDivNode({"class":"floor-Div","innerHTML":floor.floorName});
		var floorPName= HCoder.createPNode({"class":"floor-name","innerHTML":floor.floorName});
		floorsNode.appendChild(floorPName);
		window.showGoodList(floor.goods,floorDiv);
		
		floorsNode.appendChild(floorDiv);
	}	
	
}

function initGoodTabItem()
{
	tabItemList = [];
	tabItem1 = new myTabItem(); 
	tabItem1_Data= {"id":"allGood","isRegPullup":false,"isActive":false};
	tabItem1_Data["scrollItem"] = document.getElementById("scroll2");
	tabItem1_Data["extData"] = {"storeId": curStore.id};
	tabItem1.init(tabItem1_Data);
	tabItemList.push(tabItem1);
	
	tabItem2 = new myTabItem(); 
	tabItem2_Data= {"id":"newGood","isRegPullup":false,"isActive":false};
	tabItem2_Data["scrollItem"] = document.getElementById("scroll3");
	tabItem2_Data["extData"] = {"storeId": curStore.id,"isNew":"1"};
	tabItem2.init(tabItem2_Data);
	tabItemList.push(tabItem2);

}

function getTabItemById(id)
{
	for (var i=0;i<tabItemList.length;i++) {
		tabItem = tabItemList[i];
		if(tabItem.getId()==id)
		{
			return tabItem;
		}
	}
	
	return null;
}

function onChangeGoodTab(tabId)
{
//	console.log("goodTab:"+tabId);	
	if(tabId=="allGood" )
	{
		curTabItem = getTabItemById(tabId);
		reLoadTabItem();	
		console.log("allgood");	
		return ;
	}
	
	if(tabId=="newGood")
	{
		curTabItem = getTabItemById(tabId);
		reLoadTabItem();		
		console.log("newgood");	
	}	
	
}

function reLoadTabItem()
{
	if(curTabItem==null || curTabItem==undefined)
	{
		console.log("curTabItem null || undefined");
		return ;
	}
	curTabItem.initShow();
	
	curShowItem=curTabItem.getScrollItem();
	initQueryParam();
	
	if(curTabItem.getId()=="allGood")
	{
		loadProductList(null);
	}
	else
	{
		loadProductList("1");
	}
	
	
	
//	loadOrder(curTabItem.getExtData().orderStatus);			
}

function initQueryParam()
{

	queryParam["orderColunm"] = "addTime";
	queryParam["orderMode"] = "desc";
	queryParam["pageSize"] = 8; 
	queryParam["pageNumber"] = 1;
	queryParam["splitpage"] = 1; 
	
	//分页查询参数
	queryParam["_query.storeId"] = curStore.id;
	
}

/**
 * 查询加载商品列表
 * @param {Object} isNew
 */
function loadProductList(isNew)
{
	if(isNew!=null && isNew!="")
	{
		queryParam["_query.isNew"] = isNew;
	}
	else
	{
		queryParam["_query.isNew"] = "";
	}

	ajax_get_product_list(queryParam, productlistSuccess);


}

function productlistSuccess(res)
{
	curLoadGood = res;
//	console.log("good:"+JSON.stringify(res));
	if(curLoadGood.list.length>0)
	{
		
		//显示商品列表
		window.showGoodList(curLoadGood.list,curShowItem.children[0]);
		
		regOnePull();
		
		if(curTabItem.getIsReg())
		{
			if(curLoadGood.hasNextPage)
			{
				mui(curShowItem).pullToRefresh().endPullUpToRefresh();
			}
			else
			{
				mui(curShowItem).pullToRefresh().endPullUpToRefresh(true);
			}
		}		
		
	}
	else
	{
		//追加以下没有数据信息
		curTabItem.showNoData();		
	}
	
}


function regOnePull()
{
//	console.log(curTabItem.getIsReg());
	if(curTabItem.getIsReg() ==false)
	{
		
		mui(curShowItem).pullToRefresh({
		up: {
			callback: loadNextPageData
			}
		});
		curTabItem.setIsReg(true);
	}
	else
	{
		mui(curTabItem.getScrollItem()).pullToRefresh().refresh(true);
	}

	
}
function loadNextPageData()
{
	if(curLoadGood==null||curLoadGood==undefined)
	{
		return;
	}
	
	if(curLoadGood.hasNextPage==true)
	{
		setNextPageNumber();
//		loadOrder(curOrderStatus);
		if(curTabItem.getId()=="allGood")
		{
			loadProductList(null);
		}
		else
		{
			loadProductList("1");
		}
	}
	else
	{
//		console.log("已经是最后一页了");
//		mui(curShowItem).pullToRefresh().endPullUpToRefresh(true);
	}
	

}


function setNextPageNumber()
{
	queryParam["pageNumber"] += 1;
	
}