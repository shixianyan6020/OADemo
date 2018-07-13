mui.init({
	swipeBack: true
});

var curWebView;
var orderInfo;
var curAddress;
var addrList;

//支付操作
var curPay=new payOption();
mui.plusReady(function(){
	
	curWebView = plus.webview.currentWebview();
	
//	mui('#noAddress').on('tap', '.mui-icon',onAddAddress);	
	
//	orderInfo = curWebView.orderInfo;
	
//	mui.toast(curWebView.orderid);
	
//	var data = JSON.stringify(curWebView.total);
//	console.log(data);
//	mui.toast(data);
	//加载显示收货地址
	loadAddressList();
	
	if(curWebView.goods!=null || curWebView.goods!=undefined)
	{
		showGoodList(curWebView.goods);
	}
	
	if(curWebView.store!=null || curWebView.store!=undefined)
	{
		showStore(curWebView.store);
	}	
	
	//设置物流信息
	if(curWebView.traninfo!=null || curWebView.traninfo!=undefined)
	{
		showTraninfo(curWebView.traninfo);
	}	
	
	//汇总信息
	if(curWebView.total!=null || curWebView.total!=undefined)
	{
		showTotal(curWebView.total);
	}	
	
	//注册添加地址点击事件
	document.getElementById("noAddress").addEventListener('tap',onAddAddress);
	
	document.getElementById("addressInfo").addEventListener('tap',function(){
		
		if(addrList.length>0)
		{
			mui('#wm_selectspec').popover('toggle',this);	

		}
	});
	
	mui('#addressList').on('tap', '.mui-table-view-cell',onSelAddress);
	
	document.getElementById("btnSave").addEventListener('tap',onSave);
	
//	document.getElementById("totleMoney").addEventListener('tap',function(e){
//		mui('#wm_selectPayType').popover('toggle');	
//		
//	});
	
	//创建支付方式选择器
//	createPayTypeSelect(onPayType);
	curPay.init({"showBalance":true,"payTypeSelCallBack":onPayType,"paySuccessCallback":onPaySuccess});	
});

function loadAddressList()
{
	user = G_getUser();
	if(user==null)
	{
		mui.alert("请先登录");
		return;
	}
	
//	addrList = cacheGetAddrList();
//	if(addrList !=null)
//	{
//		address = getDefaultAddress();
//		setAddress(address);
//		
//		//列出地址选择器
//		if(addrList.length>0)
//		{
//			showAddressList(addrList);
//		}
//		
//		return ;
//	}
	
	var param={"userId":user.id};
	ajax_get_Address_List(param,loadAddressListSuccess);
}



function loadAddressListSuccess(res)
{
	if(res.status="success")
	{
		addrList = res.data;
		if(addrList==null || addrList.length==0)
		{
			showNoAddress(true);
			return ;
		}
		
		showNoAddress(false);
		//缓存地址列表
		cacheSaveAddrList(addrList);
		
		address = getDefaultAddress();
		setAddress(address);
		
		//列出地址选择器
		if(addrList.length>0)
		{
			showAddressList(addrList);
		}
	}
	else
	{
		mui.alert(res.description);
	}
}


function getDefaultAddress()
{
	for (i=0;i<addrList.length;i++) {
		address = addrList[i];
		if(address.isDefault)
		{
			curAddress = address;
			return address;
		}
	}
	
	if(addrList.length>0)
	{
		curAddress = addrList[0];
		return curAddress;
	}
}

/**
 * 显示没有设置收货地址
 */
function showNoAddress(bShow)
{
	var noAddress = document.getElementById("noAddress");
	var hasAddress = document.getElementById("hasAddress");
	if(bShow)
	{
		noAddress.style.display="";
		hasAddress.style.display="none";
		
	}
	else
	{
		noAddress.style.display="none";
		hasAddress.style.display="";		
	}
	
}



//缓存地址列表
function cacheSaveAddrList(addrList)
{
	if(addrList ==null || addrList==undefined)
	{
		return ;
	}
	
	plus.storage.setItem("addrList",JSON.stringify(addrList));
	
}

//获取缓存的地址列表
function cacheGetAddrList()
{
	var strAddrList= plus.storage.getItem("addrList");
	if(strAddrList==null || strAddrList==undefined)
	{
		return null;
	}
	
	addressList = JSON.parse(strAddrList);
	
	return addressList;
}


function setAddress(address)
{
	
	G_getById("addr_trueName").innerHTML="收货人:"+address.trueName;
	G_getById("addr_mobile").innerHTML=address.mobile;	
	var fullName = "";
	if(address.area!=undefined)
	{
		fullName=address.area.fullName+address.area_info;
	}
	else
	{
		fullName=address.area_info;
	}	
	
	G_getById("addr_fullName").innerHTML=fullName;
}

//地址选择完成
function onSelAddress(e)
{
//	mui.alert(this.id);
//	mui.alert("选择收货人");
//	mui('.mui-popover').popover('toggle',document.getElementById("addressList"));
	curAddress = getAddressById(this.id);
	setAddress(curAddress);

	//隐藏弹出选择窗
	mui('#wm_selectspec').popover('hide'); 
}

function getAddressById(id)
{
	for (i=0;i<addrList.length;i++) {
		address = addrList[i];
		if(address.id==id)
		{
			return address;
		}
	}
}

function showAddressList(addList)
{
	var addrListNode = document.getElementById("addressList");	
	G_removeAllChildNode(addrListNode);
	
	for (i=0;i<addList.length;i++) {
		address = addList[i];
		
		addOneAddress(address,addrListNode);
	}
}

function addOneAddress(address,parentNode)
{
	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell","id":address.id});
		
	var divContent
	if(address.isDefault) //默认地址设置为红色
	{
		divContent = HCoder.createDivNode({"class":" default"});
	}
	else
	{
		divContent = HCoder.createDivNode({"class":""});
	}
	
	var h5_Name = HCoder.createHtmlNode({"type":"h5","class":"name"});
	h5_Name.innerHTML=address.trueName;
	var h5_Number = HCoder.createHtmlNode({"type":"h5","class":"number"});
	h5_Number.innerHTML=address.mobile;
	var p_full_addr = HCoder.createHtmlNode({"type":"p","class":"address mui-ellipsis-2"});
	if(address.area!=undefined)
	{
		p_full_addr.innerHTML=address.area.fullName+address.area_info;
	}
	else
	{
		p_full_addr.innerHTML=address.area_info;
	}
	
	divContent.appendChild(h5_Name);
	divContent.appendChild(h5_Number);
	divContent.appendChild(p_full_addr);
	liNode.appendChild(divContent);
	
	parentNode.appendChild(liNode);
}

function showStore(store)
{
	document.getElementById("storeName").innerHTML=store.storeName;
	
	if(store.imgUrl==null  || store.imgUrl==undefined)
	{
		document.getElementById("storeImg").style.display="none";
	}
	else
	{
		document.getElementById("storeImg").src=store.imgUrl;
	}
}


//显示订单总计信息
function showTotal(total)
{
	var totalInfo = "总计: ¥"+total.totalFee+" 共("+total.totalCount+")件";
	
	document.getElementById("totleMoney").innerHTML=totalInfo;
	
}

//显示快递信息
function showTraninfo(traninfo)
{
	var tranDesc = "";
	
	if( traninfo.goods_transfee==1)
	{
		tranDesc = traninfo.tranType;
	}
	else
	{
		tranDesc = traninfo.tranType+"¥:"+traninfo.tranFee;
	}

	document.getElementById("traninfo").innerHTML=tranDesc;
}

function showGoodList(goods)
{
	var goodRootNode = document.getElementById("orderGood");
	G_removeAllChildNode(goodRootNode);
	
	for (i=0;i<goods.length;i++) {
		
		good = goods[i];
		
		addOneGood(good,goodRootNode);
		
	}
	
}

function addOneGood(good,parentNode)
{
	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell mui-media","id":good.id});
	
	var a = HCoder.createANode({"class":"mui-navigate-right"});
	var img = HCoder.createHtmlNode({"type":"img","class":"mui-media-object mui-pull-left"});
	img.src=good.imgSmallUrl;
	var divContent=HCoder.createDivNode({"class":"mui-media-body"});
	a.appendChild(img);
	
	var p_Name = HCoder.createHtmlNode({"type":"p","innerHTML":good.goodName});
	var p_Spec= HCoder.createHtmlNode({"type":"p","innerHTML":good.specInfo});
	var h4_price = HCoder.createHtmlNode({"type":"h4","class":"price"});
	h4_price.innerHTML="¥:"+good.price;
	
	var h5_Number = HCoder.createHtmlNode({"type":"h5","class":"saleCount"});
	h5_Number.innerHTML="X"+good.count;
	
	divContent.appendChild(p_Name);
	divContent.appendChild(p_Spec);
	divContent.appendChild(h4_price);
	divContent.appendChild(h5_Number);
	a.appendChild(divContent);
	liNode.appendChild(a);
	
	parentNode.appendChild(liNode);	
}

//确认提交订单
function onSave()
{
//	mui.alert("确认提交订单");
	if(curAddress==null || curAddress==undefined)
	{
		mui.alert("请先设置收货地址!");
		return;
	}

	mui.confirm("确定提交订单?","确认提醒",function(e){
		
		if(e.index==1)
		{
			saveConfim();
		}
	});

}

function saveConfim()
{
	var param = {};	
	orderInfo = curWebView;
	
	param["orderform.addr_id"] = curAddress.id;
	param["orderform.goods_amount"] = orderInfo.total.totalFee;
	param["orderform.totalPrice"] = orderInfo.total.totalFee;
	param["orderform.ship_price"] =orderInfo.traninfo.tranFee;
	param["orderform.store_id"] = orderInfo.store.id; 
	param["orderform.user_id"] = G_getUser().id;	
	param["orderform.order_type"] = "app";
	param["orderform.transport"] =orderInfo.traninfo.tranType;
	param["orderform.msg"] = document.getElementById("textarea").value ;
	
	var goodList=[];
	
	for (i=0;i<orderInfo.goods.length;i++) {
		
		goodSrc = orderInfo.goods[i];
		var good={};
		good["goods_id"]=goodSrc.id;
		good["price"]=goodSrc.price;
		good["count"]=goodSrc.count;
		good["spec_info"]=goodSrc.specInfo;
		
		//如果定义了购物车商品id
		if(goodSrc.sci_id!=undefined)
		{
			good["id"]=goodSrc.sci_id;
		}
		
		
		goodList.push(good);		
		
	}	
	goodInfo = JSON.stringify(goodList);
	console.log(goodInfo);
	param["goodInfo"] = goodInfo;	
	
	//订单来源
	param["fromType"] = orderInfo.orderFromType;
	
	//如果有购物车id,则带上该参数
	if(orderInfo.sc_id!=undefined)
	{
		param["sc_id"] = orderInfo.sc_id;
	}
	
//	param["orderFromType"] = "nowBuy";
	
	//购物车转换 需要处理购物车信息
//	param["orderFromType"] = "shopCart";
//	console.log(JSON.stringify(param));
	ajax_post_save_orderForm(param,saveOrderSuccess);
}



//提交保存订单成功
function saveOrderSuccess(res)
{
	if(res.status=="success")
	{
		mui.toast("订单提交成功:"+res.data);
		//刷新购物车
		window.refushCartView();
		//应该跳转到订单支付页面
//		mui('#wm_selectPayType').popover('toggle');	
		user=  G_getUser();
		var param={};
		param["orderType"]="goods";
		param["total"]=0.01; 
		param["orderNo"]=res.data;		
		param["userId"]=user.id;	
		
		console.log("param:"+JSON.stringify(param));
		curPay.setPayData(param);

		curPay.showPaySelect();				
	}
	else
	{
		mui.alert(res.description);
	}
}

function onPayType(payType)
{
//	mui.alert("支付方式:"+payType);
}

function onPaySuccess(data)
{
//	console.log("PaySuccess"+JSON.stringify(data));

	mui.alert("购买成功","提示",function(){
		mui.back();
	});
}

function onAddAddress()
{
//	alert("添加地址");

	var param = {"optionType":"add","hideCallBack":onHideAddress};
	
	openNewAddress(param);	
	
}

function onHideAddress()
{
//	console.log("hide"); 
	loadAddressList();
}
