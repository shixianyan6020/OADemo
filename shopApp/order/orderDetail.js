mui.init({
		swipeBack: true
});

var curOrderId;
var curWebView;
var curOrder;
//支付操作
var curPay=new payOption();
mui.plusReady(function(){
	
	curWebView=plus.webview.currentWebview();
	
	curOrderId = curWebView.orderId;
	
//	console.log(curOrderId);
	
	loadOrder(curOrderId);
	
	user=  G_getUser();
	curPay.init({"showBalance":true,"payTypeSelCallBack":onPayType,"paySuccessCallback":onPaySuccess});	
});

function loadOrder(orderId)
{
	user=  G_getUser();
	if(user==null)
	{
		return ;
	}	
	var param={};

	param["userId"] = user.id;
	param["orderId"] = orderId;

	ajax_post_view_orderForm(param,loadOrderSuccess);
	
}


function loadOrderSuccess(res)
{
	if(res.status=="success")
	{
		curOrder  =res.data;
		
		showOrderInfo(curOrder);
	}
	else
	{
		mui.alert(res.description);
	}
}

function showOrderInfo(order)
{
	//设置地址	
	if(order.address!=null && order.address!=undefined)
	{
//		console.log(JSON.stringify(order.address));
		setAddress(order.address);
	}
	
	//设置店铺和商品
	if(order.goods!=null || order.goods!=undefined)
	{
		showGoodList(order.goods);
	}	
	
	mui('#orderGood').on('tap', '.mui-table-view-cell',onSelGood);	
	
	
	
	//设置显示店铺
	if(order.store ==null || order.store==undefined)
	{
		order.store = {"store_name":order.store_name,"storeName":order.store_name,"id":order.store_id};
		showStore(order.store);
	}
	else
	{
		showStore(order.store);
	}
	
	if(order.logs !=null &&  order.logs!=undefined)
	{
		var logParentNode = document.getElementById("orderLog");
		showOrderLog(order,logParentNode);
	}		
	
	//订单金额
	showOrderFee(order,document.getElementById("payinfo"));
	showOrderTraninfo(order,document.getElementById("traninfo"));
	//显示状态
	showOrderStatus(order,document.getElementById("orderStatus"));
	
	//创建快捷操作按钮
	showOptionBtn(order,"orderOptionInfo",callback_orderOptionSuccess);
	
//	mui('#orderOptionInfo').on('tap', '.mui-btn',onOrderOption);	
}

//操作执行完成后的回调.等待操作完成后执行界面相关操作
function callback_orderOptionSuccess(optionData)
{
	console.log("callback:"+JSON.stringify(optionData));
	
	//操作成功后,重新加载订单列表
	loadOrder(curOrderId);
}

function onPaySuccess(data)
{
	console.log(JSON.stringify(data));
	
	//操作成功后,重新加载订单列表
	loadOrder(curOrderId);
}


function showOrderLog(order,parentNode)
{
	var logList = order.logs;
	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell "});
	var p_No = HCoder.createPNode({"innerHTML":"订单编号:"+order.order_id});
	liNode.appendChild(p_No);
	for (i=0;i<logList.length;i++) {
		log = logList[i];
		
		var p_node = HCoder.createPNode({"innerHTML":log.log_info+":"+log.addTime});
		liNode.appendChild(p_node);
	}
	
	if(parentNode!=null && parentNode!=undefined)
	{
		parentNode.appendChild(liNode);
	}
	else
	{
		var ui = HCoder.createUlNode({"class":"mui-table-view "});
		ui.appendChild(liNode);
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(ui);
	}
}

//显示订单费用
function showOrderFee(order,parentNode)
{

	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell "});
	var label = HCoder.createLabelNode({"innerHTML":"实付款(含运费):"});
	liNode.appendChild(label);

	var h4_node = HCoder.createH4Node({"class":"totalMoney ","innerHTML":"¥:"+order.totalPrice});
	liNode.appendChild(h4_node);

	if(parentNode!=null && parentNode!=undefined)
	{
		parentNode.appendChild(liNode);
	}
	else
	{
		var ui = HCoder.createUlNode({"class":"mui-table-view "});
		ui.appendChild(liNode);
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(ui);
	}
}

//显示订单运费
function showOrderTraninfo(order,parentNode)
{
	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell "});
	var label = HCoder.createLabelNode({"innerHTML":"运费:"});
	liNode.appendChild(label);

	var traninfo = order.transport+"¥:"+order.ship_price;
	var h5_node = HCoder.createH5Node({"class":"tranType ","innerHTML":traninfo});
	liNode.appendChild(h5_node);

	if(parentNode!=null && parentNode!=undefined)
	{
		parentNode.appendChild(liNode);
	}
	else
	{
		var ui = HCoder.createUlNode({"class":"mui-table-view "});
		ui.appendChild(liNode);
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(ui);
	}
}

//显示订单状态
function showOrderStatus(order,parentNode)
{
	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell "});
	var divNode = HCoder.createDivNode({"class":"mui-media-body"});

	var h5_node = HCoder.createH5Node({"class":"name "});
	h5_node.innerHTML="编号:"+order.order_id;
	var h5_status_node = HCoder.createH5Node({"class":"orderStatus ","innerHTML":order.status});
	divNode.appendChild(h5_node);
	divNode.appendChild(h5_status_node);
	liNode.appendChild(divNode);

	if(parentNode!=null && parentNode!=undefined)
	{
		parentNode.appendChild(liNode);
	}
	else
	{
		var ui = HCoder.createUlNode({"class":"mui-table-view "});
		ui.appendChild(liNode);
		var body = document.getElementsByTagName('body')[0];
		body.appendChild(ui);
	}
}






//点击商品
function onSelGood()
{
	//mui.alert(this.id);
	//打开商品详情页面
	window.pushDetailView({"product_id":this.id});
}


function onSelStore()
{
	
	
}


