
mui.init({
		
		swipeBack: true
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


//保存加载到的订单
var curOrderList=null;	
var curShowItem; //当前滚动条
var curOrderStatus="";

//分页查询参数
var queryParam={};

//当前加载的数据
var curLoadData=null;

var tabItemList=new Array();
var curTabItem=null;
//支付操作
var curPay=new payOption();
mui.plusReady(function(){
	
	initTabItem();
	
	
	currentWebview = plus.webview.currentWebview();
	currentWebview.addEventListener('hide',function(){
//			console.log("hide");
//			curShowItem.innerHTML="";
//			initQueryParam();
			},false);
		currentWebview.addEventListener('show',function(){

//			initQueryParam();
//			loadOrder(curOrderStatus,curShowItem);
			},false);
	
	document.getElementById('slider').addEventListener('slide',onSlide);

//	curShowItem = document.getElementById("scroll3");
//	curOrderStatus='20';
//	initQueryParam();
//	isRegPullup=false;
//	loadOrder(curOrderStatus,curShowItem);
	
	changeTabItem("0");
	
	user=  G_getUser();
	curPay.init({"showBalance":true,"payTypeSelCallBack":onPayType,"paySuccessCallback":onPaySuccess});
	//创建支付方式选择器
//	createPayTypeSelect(onPayType);

});

function initTabItem()
{
	tabItem1 = new myTabItem(); 
	tabItem1_Data= {"id":"0","isRegPullup":false,"isActive":false};
	tabItem1_Data["scrollItem"] = document.getElementById("scroll1");
	tabItem1_Data["extData"] = {"orderStatus":""};
	tabItem1.init(tabItem1_Data);
	tabItemList.push(tabItem1);
	
	tabItem2 = new myTabItem(); 
	tabItem2_Data= {"id":"1","isRegPullup":false,"isActive":false};
	tabItem2_Data["scrollItem"] = document.getElementById("scroll2");
	tabItem2_Data["extData"] = {"orderStatus":"10"};
	tabItem2.init(tabItem2_Data);
	tabItemList.push(tabItem2);
	
	tabItem3 = new myTabItem(); 
	tabItem3_Data= {"id":"2","isRegPullup":false,"isActive":true};
	tabItem3_Data["scrollItem"] = document.getElementById("scroll3");
	tabItem3_Data["extData"] = {"orderStatus":"20"};
	tabItem3.init(tabItem3_Data);
	tabItemList.push(tabItem3);
	
	
	tabItem4 = new myTabItem(); 
	tabItem4_Data= {"id":"3","isRegPullup":false,"isActive":false};
	tabItem4_Data["scrollItem"] = document.getElementById("scroll4");
	tabItem4_Data["extData"] = {"orderStatus":"30"};
	tabItem4.init(tabItem4_Data);
	tabItemList.push(tabItem4);	
	
}

function getTabItemById(id)
{
	for (i=0;i<tabItemList.length;i++) {
		tabItem = tabItemList[i];
		if(tabItem.getId()==id)
		{
			return tabItem;
		}
	}
	
	return null;
}

function setTabItemActive(id)
{
	for (i=0;i<tabItemList.length;i++) {
		tabItem = tabItemList[i];
		if(tabItem.getId()==id)
		{
			tabItem.setActive(true);
		}
		else
		{
			tabItem.setActive(false);
		}
	}
}

function changeTabItem(tabId)
{
	curTabItem = getTabItemById(tabId);
	reLoadTabItem();
	
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
	loadOrder(curTabItem.getExtData().orderStatus);			
}

function initShowItem()
{
	if(curShowItem==null || curShowItem==undefined)
	{
		return ;
	}
	
	
//	console.log("remove count:"+curShowItem.children[0].children.length);
	
	G_removeAllChildNode(curShowItem.children[0]);
	
	curTabItem.removeLastDataDiv();
	
}

function initQueryParam(orderStatus)
{
	user=  G_getUser();
	if(user==null)
	{
		return ;
	}
	

	queryParam["orderColunm"] = "addTime";
	queryParam["orderMode"] = "desc";
	queryParam["pageSize"] = 20; 
	queryParam["pageNumber"] = 1;
	queryParam["splitpage"] = 1; 
	
	//分页查询参数
	queryParam["_query.userId"] = user.id;
	
}


function setNextPageNumber()
{
	queryParam["pageNumber"] += 1;
	
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



function onSlide(e)
{
	if(e.detail.slideNumber == 0) {

			changeTabItem("0");
	}	
	else if(e.detail.slideNumber == 1) {
			changeTabItem("1");
		
			
	} else if(e.detail.slideNumber == 2) {
			changeTabItem("2");

	}
	else if(e.detail.slideNumber == 3) {
		changeTabItem("3");

	}
}

/**
 * 根据订单状态加载订单并显示
 * @param {Object} orderStatus
 */
function loadOrder(orderStatus)
{
	
	user=  G_getUser();
	if(user==null)
	{
		return ;
	}
		
	if(orderStatus!="")
	{
		queryParam["_query.status"] = orderStatus;	
	}
	
//	testOrder = localStorage.getItem("testOrder");
//	if(testOrder==null)
//	{
//		ajax_post_load_order_list(param,orderLoadSuccess);
//	}
//	else
//	{
//		orderLoadSuccess(JSON.parse(testOrder));
//	}
	
	ajax_post_load_order_list(queryParam,orderLoadSuccess);

}

/**
 * 订单查询回调
 * @param {Object} resData
 */
function orderLoadSuccess(resData)
{
	curLoadData = resData;
	if(resData.status=="success")
	{
		curOrderList =resData.data.list;
		
		if(curOrderList.length>0)
		{
			showOrderList(curOrderList);
			
			if(curTabItem.getIsReg())
			{
				if(curLoadData.data.hasNextPage)
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
	else
	{
		mui.toast(resData.description);
	}

}

function loadNextPageData()
{
	if(curLoadData==null||curLoadData==undefined)
	{
		return;
	}
	
	if(curLoadData.data.hasNextPage==true)
	{
		setNextPageNumber();
		loadOrder(curOrderStatus);
	}
	else
	{
//		console.log("已经是最后一页了");
//		mui(curShowItem).pullToRefresh().endPullUpToRefresh(true);
	}
	

}


function showOrderList(orderList)
{
	if(curShowItem ==undefined)
	{
		return ;
	}
	
	if(orderList.length<=0)
	{
		
//		curShowItem.innerHTML="没有数据";
		return ;
	}
	
	var parentNode = curShowItem.children[0];
	if(parentNode==null || parentNode==undefined)
	{
		parentNode = curShowItem;
	}
	
//	console.log("children count "+curShowItem.childElementCount);
	
	mui.each(orderList, function(i, order){

		createOrderHtml(order,parentNode);
	});
	
	//先取消按钮操作事件绑定
	mui('.orderOptionList').off("tap",'.mui-btn'); 
//	//注册订单操作按钮事件
	mui('.orderOptionList').on('tap', '.mui-btn',function(){
		
		var strList = new Array();
		strList = this.id.split("_");
		optionData = {};
		optionData["btnId"]=strList[0];
		optionData["orderId"]=strList[1];
		optionData["orderNo"]=strList[2];
		
		user = G_getUser();
		optionData["userId"]=user.id;
		optionData["callback"]=callback_orderOptionSuccess;
		onOrderOption(optionData,callback_orderOptionSuccess);

	});
	
	//注册点击店铺事件
	mui(".mui-table-view").off("tap",'.orderStoreDetail');
	mui(".mui-table-view").on('tap','.orderStoreDetail',onStoreDetail);
	
	//注册点击商品事件
	mui(".mui-table-view").off("tap",'.orderGood');
	mui(".mui-table-view").on('tap','.orderGood',onProductDetail);	
	
	//注册点击订单事件
	mui(".mui-table-view").off("tap",'.orderTip');
	mui(".mui-table-view").on('tap','.orderTip',onOrderDetail);	

	if(curLoadData.data.hasNextPage==true)
	{
		regOnePull();
	}
	else
	{
		curTabItem.showLastData();
	}
}


//操作执行完成后的回调.等待操作完成后执行界面相关操作
function callback_orderOptionSuccess(optionData)
{
	console.log("callback:"+JSON.stringify(optionData));
	
	//操作成功后,重新加载订单列表
	reLoadTabItem();
}

function onPaySuccess(res)
{
	if(res.resData.status=="success")
	{
//		console.log(JSON.stringify(data));
	
		mui.alert("支付成功!");
		reLoadTabItem();		
	}
	else
	{
		mui.alert(res.resData.description);
	}

}


//根据订单编号打开订单详情
function openOrderDetail(order_id)
{
	var options={};
	options["url"]="../order/order-detail.html";
	options["id"]="../order/order-detail.html";	
	options["extras"]={"orderId":order_id};	
	window.openNewWindow(options);
	

}

function createOrderHtml(order,parentNode)
{
	var orderDiv = HCoder.createDivNode({"class":"orderInfo"});
	var orderUl = HCoder.createUlNode({"class":"mui-table-view"});
	//店铺
	//设置显示店铺
	if(order.store ==null || order.store==undefined)
	{
		order.store = {"store_name":order.store_name,"storeName":order.store_name,"id":order.store_id};
	}

	createOrderStore(order,orderUl);
	
	//商品列表
	createOrderGoodList(order.goods,orderUl);
	
	//汇总信息
	order.orderTotal={"goodCount":order.goods.length,"totalPrice":order.totalPrice,"shipPrice":order.ship_price};
	showOrderFee(order.orderTotal,orderUl);
	
	//快捷菜单
	createOrderOptionBtn(order,orderUl,onOrderOption);
	
	
	orderDiv.appendChild(orderUl);
	parentNode.appendChild(orderDiv);
	
	
//	mui('#'+order.order_id).on('tap', '.mui-btn',function(){
//		
//		console.log(this.id);
//	});	
	
}

function createOrderStore(order,parentNode)
{
	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell orderStore"});
	var span = HCoder.createHtmlNode({"type":"span","class":" orderStoreDetail","id":order.store.id});
	span.innerText=order.store.store_name;
	liNode.appendChild(span);

	var spanTip = HCoder.createHtmlNode({"type":"span"});
	var orderTip= HCoder.createH5Node({"class":"orderTip","innerHTML":getTipByOrderStatus(order),"id":order.id});
	spanTip.appendChild(orderTip);
	liNode.appendChild(spanTip);
	parentNode.appendChild(liNode);
	
}

function createOrderGoodList(goods,parentNode)
{
		for (i=0;i<goods.length;i++) {
		
		good = goods[i];
		
		createOrderGood(good,parentNode);
		
	}
	
	
}


function createOrderGood(good,parentNode)
{
	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell orderGood","id":good.goods_id});
	
	var img = HCoder.createHtmlNode({"type":"img","class":"mui-media-object mui-pull-left"});
	img.src=good.imgSmallUrl;
	var divContent=HCoder.createDivNode({"class":"mui-media-body"});
	
	var p_Name = HCoder.createHtmlNode({"type":"p","class":"mui-ellipsis-2","innerHTML":good.goods_name});
	var p_Spec= HCoder.createHtmlNode({"type":"p","innerHTML":good.specInfo});
	var h4_price = HCoder.createHtmlNode({"type":"h4","class":"price"});
	h4_price.innerHTML="¥:"+good.price;
	
	var h5_Number = HCoder.createHtmlNode({"type":"h5","class":"saleCount"});
	h5_Number.innerHTML="X"+good.count;
	
	divContent.appendChild(p_Name);
	divContent.appendChild(p_Spec);
	divContent.appendChild(h4_price);
	divContent.appendChild(h5_Number);
	
	liNode.appendChild(img);
	liNode.appendChild(divContent);
	parentNode.appendChild(liNode);		
	
}

//显示订单费用
function showOrderFee(orderTotal,parentNode)
{

	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell "});
	
	var span = HCoder.createSpanNode({"class":"orderTotal "});
	span.innerHTML  = "共"+orderTotal.goodCount+"件商品 合计:¥"+orderTotal.totalPrice;
	span.innerHTML = span.innerHTML+"(含运费:¥"+orderTotal.shipPrice+")";
	
	liNode.appendChild(span);

	if(parentNode!=null && parentNode!=undefined)
	{
		parentNode.appendChild(liNode);
	}

}

//function onOrderOption(optionData)
//{
//
//	console.log("orderOption:"+JSON.stringify(optionData));
//}

//打开订单详细
function onOrderDetail(optionData)
{
	window.openOrderDetail(this.id);
//	console.log("order:"+this.id);
}

//打开商品详细
function onProductDetail(optionData)
{
	window.pushDetailView({"product_id":this.id});
//	console.log("Product:"+this.id);
}


function onStoreDetail(optionData)
{
//	mui.alert("店铺详情暂未实现!");
	//console.log("store:"+this.id);
	showStoreView({"storeId":this.id});
}

//根据订单状态生成操作按钮
function createOrderOptionBtn(order,parentNode,CallBack)
{
	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell orderOptionList"});
//	parentNode = document.getElementById(parentNodeId);
	btnList = getBtnListByOrderStatus(order);
	var span =  HCoder.createSpanNode({"id":order.order_id});
	
	for (i=0;i<btnList.length;i++) {
		
		btnInfo = btnList[i];
		btnInfo.id = btnInfo.id+"_"+order.id+"_"+order.order_id;
//		btnInfo["style"] ="margin-left: 10px;"; 
		btnNew = HCoder.createBtnNode(btnInfo);
		
		
		
		span.appendChild(btnNew);
		
	}
	liNode.appendChild(span);
	parentNode.appendChild(liNode);
		
}
