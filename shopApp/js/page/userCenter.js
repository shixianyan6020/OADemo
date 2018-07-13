

/**
 *  页面js的操作模版
 * @param {Object} $
 * @param {Object} doc
 */
(function($, doc)
{
	mui.plusReady(index_ready);
	
}(mui, document));

function index_init()
{
	
}

var user =null;
function index_ready()
{

	initShowData();
	//绑定升级事件
	var loginButton = getById("btnUpgrade");
	loginButton.addEventListener('tap',onUpgrade);
	
	getById("btnLogin").addEventListener('tap',function()
	{
		mui.openWindow({url:"sign.html",show:{autoShow:false}});
		
	});
		
	var wvs=plus.webview.all();
	for(var i=0;i<wvs.length;i++){
		console.log("webview:"+i);
		console.log(wvs[i].getURL());
		console.log(wvs[i].id);
	}



}

function initShowData()
{
	user = G_getUser();
	
	if(user==null)
	{
		getById("btnLogin").style.display="block";
		return ;
	}

	getById("btnLogin").style.display="none";
	
	console.log(user.userName);
	G_setHTMLById("p_mobile", user.mobile);
	G_setHTMLById("id_yuer", "余额:" + user.availableBalance);
	G_setHTMLById("id_jifen", "积分:" + user.integral);
	var name = getById("p_showName");
	if(user.userType == 1) {
		G_setHTMLById("p_showName", "普通会员:" + user.trueName);
		getById("btnUpgrade").style.display= "block";
	} 
	else {
		G_setHTMLById("p_showName", "VIP会员:" + user.trueName);
		getById("btnUpgrade").style.display="none";
	}
}



function onUpgrade()
{
//	refushUser();
//	user = G_getUser();
	if(user.userType==2)
	{
		mui.toast("已经是VIP会员!");
		return ;
	}

	if(parseFloat(user.availableBalance)<parseFloat("398"))
	{
		mui.toast("升级VIP需要398,您的余额不足,请先充值!");
		return;
	}
	
	//mui.alert("升级");
	mui.confirm("确定要升级VIP会员吗?系统会从你账户中扣除398元!","确认",onConfirmUpgrade);
	
}

function onConfirmUpgrade(e)
{
	if(e.index==1)
	{
		return ;
	}
	
	var param = {};
	param["userId"] = user.id; 
	param["recommendMobile"] = "";
	
	G_ajaxPost(G_getHostUrl()+"user/upgrade",param,success_Upgrade);
	
	
}

function success_Upgrade(response)
{
	if(response.status=="success")
	{
		refushUser();
	}
	else
	{
		mui.toast(response.description);
	}
}

function refushUser()
{
	var param = {};
	param["userId"] = user.id; 
	G_ajaxPost(G_getHostUrl()+"user/userCenter",param,success_refushUser);
	
}

function success_refushUser(response)
{
	if(response==null)
	{
		return ;
	}
	
	G_saveJson("user",response);
	G_saveText("userId",response.id);
		
	initShowData();
	
}


