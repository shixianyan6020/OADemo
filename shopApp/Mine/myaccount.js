mui.init({
	swipeBack: true
});
var channel = null;
var channelList = null;
//当前充值对象
var curPredeposit = {};

/**
 * 用户升级处理对象
 */
var curUserUpGrade=null;

//支付操作
var curPay=new payOption();
mui.plusReady(function(){
	
	//升级VIP对象
	curUserUpGrade = new userUpGrade();
	curUserUpGrade.init({"btnUpgrade":"btnUpgrade",
							"successCallback":upGradeSuccess});
	
	
	initData();
	
	document.getElementById('slider').addEventListener('slide',onSlide);	
	
	//默认为支付宝支付
	curPredeposit["pd_payment"]="alipay";
	
	var btnPre = document.getElementById("btnPre");
	btnPre.addEventListener("tap",onPreMoney);
	
	user=  G_getUser();
	curPay.init({"showBalance":false,"payTypeSelCallBack":onPayType,"paySuccessCallback":predepositPaySuccess});	
	
	
});

function onSlide(e)
{
	var slideNumber = e.detail.slideNumber;
	if( slideNumber== 0)
	{
		reflushUserInfo();
//		console.log("刷新余额");
	}
	else if(slideNumber== 1)
	{
		loadPredepositRecord();
//		console.log("加载充值记录");
	}
	else if(slideNumber== 2)
	{
//		console.log("刷新充值状态");
	}
}

function initData()
{
	user = G_getUser();
	if(user!=null)
	{
		document.getElementById("sp_account").innerText="￥"+user.availableBalance+"元";
	}
	
	G_setValue("predeposit.pd_amount","");
	G_setValue("predeposit.pd_admin_info","");	
	
	
}

function onPayType(data)
{
//	console.log("payType:"+JSON.stringify(data));
	
	//设置支付方式:
	ajax_post_predeposit_setPayment(data,predepositSetPaymentSuccess);
	
	
}

function predepositSetPaymentSuccess(res)
{
	
	
	
}

function onPreMoney()
{
	//判断充值数据是否合法
	var pd_amount = G_getValue("predeposit.pd_amount");
	if(pd_amount=="")
	{
		mui.alert("充值金额不能为空且必须大于0");
		return ;
	}
	
	if(parseFloat(pd_amount)<=0)
	{
		mui.alert("充值金额必须大于0");
		return ;
	}
	user = G_getUser();
	curPredeposit["userId"]=user.id;
	curPredeposit["pd_amount"]=pd_amount;
	curPredeposit["pd_user_id"]=user.id;
//	curPredeposit["predeposit.pd_payment"] = ""; 
	curPredeposit["pd_admin_info"] = G_getValue("predeposit.pd_admin_info"); 
	
	console.log(JSON.stringify(curPredeposit));
	
	var param={};
	param["userId"] = user.id; 
	param["predeposit.pd_user_id"] = user.id; 
	param["predeposit.pd_amount"] = pd_amount; 
	param["predeposit.pd_payment"] = ""; 
	param["predeposit.pd_admin_info"] = curPredeposit.pd_admin_info; 	
	
	mui.confirm("确定要充值吗?","确认提示","",function(e){
		
		if(e.index==1)
		{
			ajax_post_save_predeposit(param,predepositSaveSuccess);
		}
		
	});
	
}

/**
 * 提交保存成功回调
 * @param {Object} res
 */
function predepositSaveSuccess(res)
{
	if(res.status=="success")
	{
		console.log("predeposit:"+JSON.stringify(res.data));
		
		user=  G_getUser();
		var param={};
		param["orderType"]="cach";
		param["total"]=res.data.pd_amount; 
		param["orderNo"]=res.data.pd_sn;		
		param["userId"]=user.id;	
		curPay.setPayData(param);

		curPay.showPaySelect();		
				
	}
	else
	{
		mui.alert(res.description);
	}
	
}

/**
 * 充值支付成功 
 * @param {Object} res
 */
function predepositPaySuccess(res)
{	
//	console.log("predepositPaySuccess:"+JSON.stringify(res));
	
	reflushUserInfo();
}

function reflushUserInfo()
{
	user = G_getUser();
	if(user!=null)
	{
		var param={};
		param["userId"]=user.id;
		ajax_get_user_center(param,requestUserCenterSuccess);
	}
	else
	{
		mui.toast("请先登录");
	}

}

/**
 * 升级成功后的回调
 */
function upGradeSuccess()
{
	mui.alert("恭喜您,升级成功!");
}
/**
 * 用户信息获取成功
 * @param {Object} res
 */
function requestUserCenterSuccess(res)
{	
//	console.log("requestUserCenterSuccess:"+JSON.stringify(res));
	if(res.status=="success")
	{
		G_saveJson("user",res.data);
//		plus.storage.setItem("user",JSON.stringify(res.data));
		
		initData();
	}
	else
	{
		mui.alert(res.description);
	}
}

function loadPredepositRecord()
{
	user = G_getUser();
	if(user!=null)
	{
		var param={};
		param["userId"]=user.id;
		ajax_post_predeposit_record_success(param,loadPredepositRecordSuccess);
	}
	else
	{
		mui.toast("请先登录");
	}	

}

function loadPredepositRecordSuccess(res)
{
	if(res.status=="success")
	{
		showPredepositRecord(res.data);
	}
	else
	{
		mui.alert(res.description);
	}	
	
}

/**
 * 显示充值记录
 * @param {Object} depositList
 */
function showPredepositRecord(depositList)
{
	curShowItem = document.getElementById("item2mobile");
	if(depositList.length<=0)
	{
		curShowItem.innerHTML="没有数据";
		return ;
	}	
	
	var parentNode = curShowItem.children[0];
	if(parentNode==null || parentNode==undefined)
	{
		parentNode = curShowItem;
	}	
	
	G_removeAllChildNode(parentNode);
	
	var storeUl = HCoder.createUlNode({"class":"mui-table-view"});
	
	mui.each(depositList, function(i, deposit){

		showOneDeposit(deposit,storeUl);
	});		
	
	parentNode.appendChild(storeUl);
}

function showOneDeposit(deposit,parentNode)
{
	if(deposit.pd_admin_id==null)
	{
		deposit.pd_admin_id="";
	}
	
	if(deposit.paymentType==null)
	{
		deposit.paymentType="";
	}	
	
	
	var liNode = HCoder.createLiNode({"class":"mui-table-view-cell"});
	
	var p_Node = HCoder.createPNode({"innerHTML":"充值时间:"+deposit.addTime});
	var p_Node2 = HCoder.createPNode({"innerHTML":"充值金额:"+deposit.pd_amount});
	var p_Node3 = HCoder.createPNode({"innerHTML":"充值单号:"+deposit.pd_sn});
	var p_Node4 = HCoder.createPNode({"innerHTML":"充值备注:"+deposit.pd_admin_id});	
	
	var payStatus="未支付";
	if(deposit.pd_status==0)
	{
		
	}
	else
	{
		payStatus="已支付";
	}
	var p_Node5 = HCoder.createPNode({"innerHTML":"支付状态:"+payStatus});	
	var p_Node6 = HCoder.createPNode({"innerHTML":"支付方式:"+deposit.paymentType});		
	
	
	liNode.appendChild(p_Node);
	liNode.appendChild(p_Node2);
	liNode.appendChild(p_Node3);
	liNode.appendChild(p_Node4);
	liNode.appendChild(p_Node5);	
	liNode.appendChild(p_Node6);	
	
	parentNode.appendChild(liNode);
	
	
}


