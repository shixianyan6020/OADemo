
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
	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell mui-media","id":good.goods_id});
	
	var a = HCoder.createANode({"class":"mui-navigate-right"});
	var img = HCoder.createHtmlNode({"type":"img","class":"mui-media-object mui-pull-left"});
	img.src=good.imgSmallUrl;
	var divContent=HCoder.createDivNode({"class":"mui-media-body"});
	a.appendChild(img);
	
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
	a.appendChild(divContent);
	liNode.appendChild(a);
	
	parentNode.appendChild(liNode);	
}

function getBtnListByOrderStatus(order)
{
	var btnList = [];
	var status = order.order_status;
	if(status=="0") //已取消
	{
		btnList.push({"id":"btnDelOrder","innerHTML":"删除订单","class":"mui-btn"});
		
	}
	else if(status=="10") //待付款
	{
		btnList.push({"id":"btnCancelOrder","innerHTML":"取消订单","class":"mui-btn"});
		btnList.push({"id":"btnPayOrder","innerHTML":"去付款","class":"mui-btn mui-btn-red defaultOption","style":"margin-left: 10px;"});
	}
	else if(status=="20") //待发货
	{
		btnList.push({"id":"btnSendOrder","innerHTML":"提醒发货","class":"mui-btn mui-btn-red  defaultOption"});
	}	
	else if(status=="30") //待收货
	{
		btnList.push({"id":"btnRecOrder","innerHTML":"确认收货","class":"mui-btn  mui-btn-red defaultOption"});
	}	
	else if(status=="40") //待评价
	{
		btnList.push({"id":"btnEvOrder","innerHTML":"评价","class":"mui-btn  mui-btn-red defaultOption"});
	}	
	else if(status=="50") //已完成
	{
		btnList.push({"id":"btnDelOrder","innerHTML":"删除订单","class":"mui-btn"});
		btnList.push({"id":"btnReEvOrder","innerHTML":"追加评价","class":"mui-btn mui-btn-red defaultOption"});
	}	
	
	return btnList;
}


//根据订单状态生成操作按钮
function showOptionBtn(order,parentNodeId,CallBack)
{
	
	parentNode = document.getElementById(parentNodeId);
	btnList = getBtnListByOrderStatus(order);
	
	for (i=0;i<btnList.length;i++) {
		
		btnInfo = btnList[i];
		btnInfo["style"] ="margin-left: 10px;"; 
		btnInfo.id = btnInfo.id+"_"+order.id+"_"+order.order_id;
		btnNew = HCoder.createBtnNode(btnInfo);
		
		parentNode.appendChild(btnNew);
	}
	
	mui('#'+parentNodeId).on('tap', '.mui-btn',function(){
		
//			var btnInfo={};
//			btnInfo["orderId"] = order.id;
//			btnInfo["btnId"] = this.id;
//			CallBack(btnInfo);
			
		var strList = new Array();
		strList = this.id.split("_");
		optionData = {};
		optionData["btnId"]=strList[0];
		optionData["orderId"]=strList[1];
		optionData["orderNo"]=strList[2];
		
		user = G_getUser();
		optionData["userId"]=user.id;
		optionData["callback"]=CallBack;
		onOrderOption(optionData,CallBack);			
		
	});
	
}

function getTipByOrderStatus(order)
{
	var orderTip="";
	var status = order.order_status;
	if(status=="0") //已取消
	{
		orderTip="已取消";
		
	}
	else if(status=="10") //待付款
	{
		orderTip="等待买家付款";
	}
	else if(status=="20") //待发货
	{
		orderTip="等待卖家发货";
	}	
	else if(status=="30") //待收货
	{
		orderTip="等待买家收货";
	}	
	else if(status=="40") //待评价
	{
		orderTip="待评价";
	}	
	else if(status=="50") //已完成
	{
		orderTip="已完成";
	}	
	
	return orderTip;
}

var curOrderOption=null;

function onOrderOption(optionData,CallBack)
{

	curOrderOption = optionData;
	var btnId = optionData.btnId;
	if(btnId=="btnDelOrder")
	{
		mui.confirm("确定删除订单吗?","删除确认",function(e){
		
			if(e.index==1)
			{
				optionData["action"]="delete";
				orderOptionRequest(optionData);	
			}
		});
		
	}
	else if(btnId=="btnCancelOrder")//取消订单
	{
		mui.confirm("确定取消订单吗?","取消确认",function(e){
		
			if(e.index==1)
			{
				optionData["action"]="cancel";
				orderOptionRequest(optionData);		
			}
		});
	}
	else if(btnId=="btnSendOrder") //提醒发货
	{
		optionData["action"]="sendPrompt";
		orderOptionRequest(optionData);		
//		mui.alert("评价功能待完善!");
		
	}	
	else if(btnId=="btnPayOrder") //付款
	{
//		optionData.callback(optionData);
//		showPaySelect();
		user=  G_getUser();
		var param={};
		param["orderType"]="goods";
		param["total"]=0.01;
		param["orderNo"]=optionData.orderNo;		
		param["userId"]=user.id;	
		curPay.setPayData(param);

		curPay.showPaySelect();
	}	
	else if(btnId=="btnRecOrder") //确认收货
	{
		mui.confirm("确认收货吗?","收货确认",function(e){
		
			if(e.index==1)
			{
				optionData["action"]="finish";
				orderOptionRequest(optionData);		
			}
		});
	}	
	else if(btnId=="btnEvOrder") //评价
	{
		mui.alert("评价功能待完善!");
	}	
	else if(btnId=="btnReEvOrder") //追加评价
	{
		mui.alert("追加评价功能待完善!");
	}	
	
}

//远程请求操作订单
function orderOptionRequest(optionData)
{
	ajax_post_option_orderForm(optionData,ajax_callback_orderOptionSuccess);
	
}


/**
 * 删除订单远程回调
 * @param {Object} res
 */
function ajax_callback_orderOptionSuccess(optionData)
{
//	console.log(JSON.stringify(optionData));
	
	if(optionData.resData.status=="success")
	{
		mui.toast("操作成功!");
		optionData.callback(optionData);
	}
	else
	{
		mui.alert("操作失败:"+optionData.resData.description);
	}
	
//	curOrderOption.callback(curOrderOption);
}


function onPayType(payType)
{

}




