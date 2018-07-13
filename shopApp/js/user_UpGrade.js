var userUpGrade=function()
{
	/**
	 * 相关配置参数
	 */
	var _config={};
	
	/**
	 * 初始化
	 * @param {Object} options
	 */
	var init= function(options)
	{
//		console.log("init");
		if(options==null || options==undefined)
		{
			return ;
		}
		
		_config = options;
		
		regEvent();
		
	};
	
	//注册升级按钮事件
	var regEvent = function()
	{
		var btnOk =  document.getElementById(_config.btnUpgrade);
		btnOk.addEventListener('tap',onUpgrade);
		
	};
	
	
	/**
	 * 升级
	 */
	var onUpgrade = function()
	{
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
				
		
	};
	
	var  onConfirmUpgrade= function(e)
	{
		if(e.index==0)
		{
			return ;
		}
		
		var param = {};
		param["userId"] = user.id; 
//		param["recommendMobile"] = G_getValue(_config.recommendMobile);
		param["waitTip"] = "处理中....";
		
		ajax_post_upgrade_vip(param,success_Upgrade);		
	};
	
	/**
	 * 升级成功回调
	 * @param {Object} res
	 */
	var success_Upgrade = function(res)
	{
		if(res.status=="success")
		{
			var user = res.data;
			if(user==null)
			{
				mui.alert("返回数据不正确,登录失败!");
				return;
			}
			
			G_saveUser(user);
			notifyOtherView();
			
			if(_config.successCallback!=undefined)
			{
				_config.successCallback();
			}
		}
		else
		{
			mui.toast(res.description);
		}		
	};
	
	/**
	 * 通知消息
	 */
	var notifyOtherView=function()
	{
		//通知主界面刷新用户数据
		var minewebview = plus.webview.getWebviewById('baritemHtml/mine.html');
		mui.fire(minewebview, 'loginSuccess', {});			
		
	};
	
	
	return {
		init:init
	};

}
