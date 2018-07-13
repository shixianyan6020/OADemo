mui.init({
	swipeBack:true

//	pullRefresh: {
//		container: '#refreshContainer',
//		down: {
//			height: 50,
//			contentdown: "下拉刷新",
//			contentover: "释放立即刷新",
//			contentrefresh: "正在刷新...",
//			callback: pulldownRefresh
//		}
//	}
});

(function($) {

                
	//阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});

})(mui);

		
//tab数量
var tabItemList=new Array();
//当前激活的tabitem
var curTabItem=null;
//保存加载到的收藏商品
var curGoodList=null;	
//保存加载到的收藏店铺
var curStoreList=null;
var curShowItem; //当前滚动条
//当前收藏类型
var curFavirateType="favirate_good";

mui.plusReady(function(){

	initTabItem();
	
	document.getElementById('slider').addEventListener('slide',onSlide);
	
	changeTabItem("0");
	
//	mui('#refreshContainer').pullToRefresh({
//		down: {
//			height: 50,
//			contentdown: "下拉刷新",
//			contentover: "释放立即刷新",
//			contentrefresh: "正在刷新...",
//			callback: pulldownRefresh
//		}
//	});
	
	
	
//					//循环初始化所有下拉刷新，上拉加载。
//					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
//						mui(pullRefreshEl).pullToRefresh({
//							up: {
//								callback: function() {
//									var self = this;
//									setTimeout(function() {
////										var ul = self.element.querySelector('.mui-table-view');
////										ul.appendChild(createFragment(ul, index, 5));
//										self.endPullUpToRefresh();
//									}, 500);
//								}
//							}
//						});
//					});	
	
			
});

/**
 * 初始化tab窗口对象
 */
function initTabItem()
{
	tabItem1 = new myTabItem(); 
	tabItem1_Data= {"id":"0","isRegPullup":true,"name":"收藏商品","isActive":true};
	tabItem1_Data["scrollItem"] = document.getElementById("scroll1");
	tabItem1_Data["extData"] = {"favirateType":"favirate_good"};
	tabItem1.init(tabItem1_Data);
	tabItemList.push(tabItem1);
	
	tabItem2 = new myTabItem(); 
	tabItem2_Data= {"id":"1","isRegPullup":true,"name":"收藏店铺","isActive":false};
	tabItem2_Data["scrollItem"] = document.getElementById("scroll2");
	tabItem2_Data["extData"] = {"favirateType":"favirate_store"};
	tabItem2.init(tabItem2_Data);
	tabItemList.push(tabItem2);

}


function pulldownRefresh()
{
	mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed 
}

function onSlide(e)
{
	var slideNumber = e.detail.slideNumber;
	if( slideNumber== 0)
	{
		changeTabItem("0");		
	}
	else if(slideNumber== 1)
	{
		changeTabItem("1");	
	}

}



function changeTabItem(tabId)
{
	curTabItem = getTabItemById(tabId);
	curFavirateType = curTabItem.getExtData().favirateType;
	console.log(JSON.stringify(curTabItem.getExtData()));	
	reLoadTabItem();	
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


function reLoadTabItem()
{
	if(curTabItem==null || curTabItem==undefined)
	{
		console.log("curTabItem null || undefined");
		return ;
	}
	curTabItem.initShow();
	
	curShowItem=curTabItem.getScrollItem();

	loadFavirate(curTabItem.getExtData());	

}

/**
 * 根据收藏类型加载收藏内容
 * @param {Object} orderStatus
 */
function loadFavirate(opsData )
{
	
	user=  G_getUser();
	if(user==null)
	{
		return ;
	}
		
	
	queryParam = {"userId":user.id};
	if(opsData!=null && opsData!=undefined)
	{
		queryParam["favirateType"] = opsData.favirateType;	
	}
	
	// ajxa 远程查询
	ajax_post_load_favirate(queryParam,favirateLoadSuccess);
}

/**
 * 收藏商品加载成功
 * @param {Object} resData
 */
function favirateLoadSuccess(resData)
{
	if(resData.status=="success")	
	{
		console.log(JSON.stringify(curTabItem.getExtData()));
		if(curTabItem.getExtData().favirateType=="favirate_good")
		{
			curGoodList = resData.data;
			showFavirateGood(curGoodList);			
		}
		else
		{
			curStoreList = resData.data;
			showFavirateStore(curStoreList);
		}
		
		regAllEvent();
	}
	else
	{
		mui.toast(resData.description);
	}
	
}

function showFavirateGood(goodList)
{
	if(curShowItem ==undefined)
	{
		return ;
	}	
	
	if(goodList.length<=0)
	{
		curShowItem.innerHTML="没有数据";
		return ;
	}	
	
	var parentNode = curShowItem.children[0];
	if(parentNode==null || parentNode==undefined)
	{
		parentNode = curShowItem;
	}	
	
	mui.each(goodList, function(i, good){

		createOneGoodHtml(good,parentNode);
	});
	
//	console.log("curTabItem null || undefined");
//	curShowItem.innerHTML="没有数据";
	
}

/**
 * 创建一个收藏商品节点
 * @param {Object} good
 * @param {Object} parentNode
 */
function createOneGoodHtml(good,parentNode)
{
	good["select"] = {"nodeId":"node_"+good.id};
	var goodUl = HCoder.createUlNode({"class":"mui-table-view"});


	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell goodLi"});
	liNode.id = good.select.nodeId;
	
	var divLeft=HCoder.createDivNode({"class":"leftClassCell"});
	var img = HCoder.createHtmlNode({"type":"img","class":"cellImg"});
	img.src=good.imgSmallUrl;
	divLeft.appendChild(img);
	
	//right
	var divRight=HCoder.createDivNode({"class":"rightClassCell"});
	var p_Name = HCoder.createHtmlNode({"id":good.goods_id,"type":"p","class":"mui-ellipsis-2 goodName","innerHTML":good.goods_name});
	var h4_price = HCoder.createHtmlNode({"type":"h4","class":"price"});
	h4_price.innerHTML="¥:"+good.store_price;
	
	var delBtn =HCoder.createBtnNode({"id":good.id,"innerHTML":"取消","class":"mui-btn mui-btn-red favirateGoodDel"});
	
	divRight.appendChild(p_Name);
	divRight.appendChild(h4_price);
	divRight.appendChild(delBtn);
	
	liNode.appendChild(divLeft);
	liNode.appendChild(divRight);
	goodUl.appendChild(liNode);	
		

	//快捷菜单
//	createOrderOptionBtn(order,orderUl,onOrderOption);
	
	parentNode.appendChild(goodUl);
	
	
//	mui('#'+order.order_id).on('tap', '.mui-btn',function(){
//		
//		console.log(this.id);
//	});	
	
}

function openGoodDetail(goodId)
{
	//mui.alert("打开商品详细页面:"+goodId);
	window.pushDetailView({"product_id":goodId});
}

function openStore(storeId)
{
	mui.alert("打开店铺页面:"+storeId);
}


//显示收藏店铺
function showFavirateStore(storeList)
{
	if(curShowItem ==undefined)
	{
		return ;
	}	
	
	if(storeList.length<=0)
	{
		curShowItem.innerHTML="没有数据";
		return ;
	}	
	
	var parentNode = curShowItem.children[0];
	if(parentNode==null || parentNode==undefined)
	{
		parentNode = curShowItem;
	}	
	
	mui.each(storeList, function(i, store){

		createOneStoreHtml(store,parentNode);
	});	
	
}


/**
 * 创建一个收藏店铺节点
 * @param {Object} good
 * @param {Object} parentNode
 */
function createOneStoreHtml(store,parentNode)
{
	store["select"] = {"nodeId":"node_"+store.id};
	var storeUl = HCoder.createUlNode({"class":"mui-table-view"});

	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell storeLi"});
	liNode.id = store.select.nodeId;
	
	var divLeft=HCoder.createDivNode({"class":"leftClassCell"});
	var img = HCoder.createHtmlNode({"type":"img","class":"cellImg"});
	img.src=store.logoUrl;
	divLeft.appendChild(img);
	
	//right
	var divRight=HCoder.createDivNode({"class":"rightClassCell"});
	var p_Name = HCoder.createHtmlNode({"id":store.store_id,"type":"p","class":"mui-ellipsis-2 storeName","innerHTML":store.store_name});

	
	var delBtn =HCoder.createBtnNode({"id":store.id,"innerHTML":"取消","class":"mui-btn mui-btn-red favirateStoreDel"});
	
	divRight.appendChild(p_Name);

	divRight.appendChild(delBtn);
	
	liNode.appendChild(divLeft);
	liNode.appendChild(divRight);
	storeUl.appendChild(liNode);	
		
	parentNode.appendChild(storeUl);
	
}


function regAllEvent()
{
	
	mui('.rightClassCell').on('tap', '.goodName', function() {
		
		openGoodDetail(this.id);
	});		
	
	mui('.rightClassCell').on('tap', '.favirateGoodDel', function() {
		
		onDel("favirate_good",this.id);
	});	
	
	
	mui('.rightClassCell').on('tap', '.storeName', function() {
		
		openStore(this.id);
	});		
	
	mui('.rightClassCell').on('tap', '.favirateStoreDel', function() {
		
		onDel("favirate_store",this.id);
	});		
	
}

function onDel(favirateType,id)
{

	mui.confirm("确定要取消收藏吗?", "提醒", ['确认', '取消'], function(e) {
		if(e.index == 0) {
			var param= {"id":id};
			ajax_delete_favirate_item(param,deleteItemSuccess);
			}
	});		

}

function deleteItemSuccess(resData)
{
	if(resData.status=="success")
	{
		item = getItemById(curFavirateType, resData.data);
		if(item != null) {
			deleteNodeById(item.select.nodeId);	
		}
	}
	else
	{
		mui.toast(resData.description);		
	}
}

/**
 * 根据类型和id查找对象
 */
function getItemById(favirateType,id)
{
	if(favirateType=="favirate_good")
	{
		for (var i=0;i<curGoodList.length;i++) {
			
			good = curGoodList[i];
			if(good.id==id)
			{
				return good;
			}
		}
		return null;
	}
	
	for(var i = 0; i < curStoreList.length; i++) {

		store = curStoreList[i];
		if(store.id == id) {
			return store;
		}
	}
	return null;
}



//html中删除
function deleteNodeById(nodeId)
{
	//删除节点
	var goodNode = document.getElementById(nodeId);
	if(goodNode !=undefined)
	{
		parentNode = goodNode.parentNode;
		if(parentNode !=undefined)
		{
			parentNode.removeChild(goodNode);
		}
		else
		{
			console.log("parent is undefined");
		}
	}
	
}

