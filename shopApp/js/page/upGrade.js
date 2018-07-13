mui.init({
	swipeBack: true
});

mui.plusReady(function(){
	
	var btnOK = document.getElementById("btnOK");
	btnOK.addEventListener('tap',onUpgrade);
	
//	console.log("init");
	
});


function onUpgrade()
{	
//	mui.toast(mui.os.iphone+"_"+mui.os.android+" "+mui.os.version);
//	logData("ddd");
//	refushUser();
	user = G_getUser();
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

	
	mui.confirm("确定要升级VIP会员吗?系统会从你账户中扣除398元!","确认",onConfirmUpgrade);
	
}

function onConfirmUpgrade(e)
{
//	logData(e.index);
	if(e.index==0)
	{
		return ;
	}
	
	var param = {};
	param["userId"] = user.id; 
	param["recommendMobile"] = G_getValue("recommendMobile");
	param["waitTip"] = "处理中....";
	
	ajax_post_upgrade_vip(param,success_Upgrade);
}

function success_Upgrade(response)
{
	if(response.status=="success")
	{
//		initShowData();
		var user = response.data;
		if(user==null)
		{
			mui.alert("返回数据不正确,登录失败!");
			return;
		}
		
		G_saveUser(user);
		notifyOtherView();
		mui.back();
		mui.toast('升级成功!');
		
	}
	else
	{
		mui.toast(response.description);
	}
}

function notifyOtherView()
{
	var minewebview = plus.webview.getWebviewById('baritemHtml/mine.html');
	mui.fire(minewebview, 'loginSuccess', {});	
}
